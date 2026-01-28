'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { createClient } from '@/lib/supabase/client';
import { getCollaborationConfig } from '@/lib/config/collaboration';
import EditorToolbar from './EditorToolbar';
import EditorPresenceBar from './EditorPresenceBar';
import type { CollaborativeEditorProps, CollaboratorPresence } from './types';
import { getUserColor } from './types';

export default function CollaborativeEditor({
  contractId,
  initialContent,
  onContentChange,
  onSave,
  maxCollaborators = 3,
  readOnly = false,
}: CollaborativeEditorProps) {
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Initialize user and presence
  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profile) {
        setCurrentUser({
          id: profile.id,
          name: profile.full_name || 'Usuario',
          color: getUserColor(profile.id),
          avatar: profile.avatar_url,
        });
      }
    };

    initUser();
  }, [supabase]);

  // Initialize Yjs WebSocket provider with Awareness
  useEffect(() => {
    if (!currentUser) return;

    console.log('[Editor] Initializing provider with content:', initialContent?.substring(0, 100));

    const config = getCollaborationConfig();

    // FALLBACK MODE: Skip WebSocket, use local Yjs only
    if (config.mode === 'fallback' || !config.websocketUrl) {
      console.log('[Editor] Running in fallback mode (no real-time collaboration)');
      // Create a dummy provider that's always "connected" for compatibility
      setProvider({ synced: true, awareness: null } as any);
      return;
    }

    console.log('[Editor] Initializing WebSocket provider:', config.websocketUrl);

    const wsProvider = new WebsocketProvider(
      config.websocketUrl,
      `lexy-contract-${contractId}`,
      ydoc,
      {
        params: {
          userId: currentUser.id,
          userName: currentUser.name,
        },
      }
    );

    // Store initial content population flag
    let hasPopulated = false;

    // Check connected users count before allowing connection
    wsProvider.on('sync', (isSynced: boolean) => {
      if (isSynced && !hasPopulated) {
        console.log('[Editor] Yjs synced');

        const awareness = wsProvider.awareness;
        const connectedCount = awareness.getStates().size;

        if (connectedCount > maxCollaborators) {
          alert(`Este contrato ya tiene ${maxCollaborators} usuarios editando. Intenta más tarde.`);
          wsProvider.destroy();
          return;
        }

        // Set local awareness state
        awareness.setLocalState({
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: '', // We don't have email in currentUser
            color: currentUser.color,
            avatar_url: currentUser.avatar || null,
          },
          cursor: null,
        });

        // Listen to awareness changes
        const updateCollaborators = () => {
          const states = Array.from(awareness.getStates().entries());
          const presences: CollaboratorPresence[] = states
            .filter(([clientId]) => clientId !== awareness.clientID)
            .map(([_, state]: [number, any]) => ({
              user_id: state.user?.id || 'unknown',
              full_name: state.user?.name || 'Usuario Anónimo',
              avatar_url: state.user?.avatar_url || null,
              color: state.user?.color || '#999999',
              last_seen: Date.now(),
            }));

          setCollaborators(presences);
        };

        awareness.on('change', updateCollaborators);
        updateCollaborators(); // Initial update

        hasPopulated = true;

        // Cleanup awareness listener
        return () => {
          awareness.off('change', updateCollaborators);
        };
      }
    });

    // Handle connection errors
    wsProvider.on('connection-error', (error: any) => {
      console.error('[Editor] WebSocket connection error:', error);
      // Don't alert the user - fallback will handle it gracefully
    });

    setProvider(wsProvider);

    // Cleanup
    return () => {
      wsProvider.destroy();
    };
  }, [contractId, ydoc, currentUser, maxCollaborators, initialContent]);

  // Update last_seen_at heartbeat in database
  useEffect(() => {
    if (!currentUser || !provider) return;

    const updatePresence = async () => {
      try {
        await fetch(`/api/contracts/${contractId}/collaborators/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: currentUser.id,
          }),
        });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    // Initial update
    updatePresence();

    // Update every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [contractId, currentUser, provider]);

  // Initialize Tiptap editor (only after provider and user are ready)
  const editor = useEditor(
    {
      extensions: provider && currentUser
        ? [
            StarterKit.configure({
              history: false, // Important: disable history when using Yjs
            }),
            Collaboration.configure({
              document: ydoc,
            }),
            // Only add CollaborationCursor if we have real awareness (not fallback mode)
            ...(provider.awareness
              ? [
                  CollaborationCursor.configure({
                    provider: provider,
                    user: {
                      name: currentUser.name,
                      color: currentUser.color,
                    },
                  }),
                ]
              : []),
          ]
        : [
            StarterKit.configure({
              history: false,
            }),
          ],
      // DO NOT set content when using Collaboration - Yjs manages content
      editable: !readOnly,
      immediatelyRender: false, // Fix SSR hydration mismatch
      onUpdate: ({ editor }) => {
        const content = editor.getHTML();
        onContentChange?.(content);
      },
    },
    [provider, currentUser, ydoc]
  ); // Re-initialize when provider or user changes

  // Populate Yjs document with initial content ONLY if empty
  useEffect(() => {
    if (!editor || !provider) return;

    const config = getCollaborationConfig();

    // FALLBACK MODE: Set content directly (no sync needed)
    if (config.mode === 'fallback') {
      console.log('[Editor] Fallback mode: setting initial content');
      if (initialContent) {
        editor.commands.setContent(initialContent);
      }
      return;
    }

    // WEBSOCKET MODE: Wait for sync before setting content
    const handleSync = (isSynced: boolean) => {
      if (isSynced) {
        console.log('[Editor] Editor synced, checking content');

        // Get the Yjs XmlFragment that Tiptap uses
        const yXmlFragment = ydoc.getXmlFragment('default');

        console.log('[Editor] Yjs doc children count:', yXmlFragment.length);

        // Only populate if the document is empty
        if (yXmlFragment.length === 0 && initialContent) {
          console.log('[Editor] Populating empty Yjs doc with initial content');

          // Set content through the editor (which will update Yjs)
          editor.commands.setContent(initialContent);
        } else {
          console.log('[Editor] Using existing synced content');
        }

        // Remove listener after first sync
        provider.off('sync', handleSync);
      }
    };

    provider.on('sync', handleSync);

    // If already synced, run immediately
    if (provider.synced) {
      handleSync(true);
    }

    return () => {
      provider.off('sync', handleSync);
    };
  }, [editor, provider, ydoc, initialContent]);

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !onSave) return;

    let saveTimeout: NodeJS.Timeout;

    const handleUpdate = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        const content = editor.getHTML();
        setIsSaving(true);
        try {
          await onSave(content);
        } catch (error) {
          console.error('Error saving:', error);
        } finally {
          setIsSaving(false);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      clearTimeout(saveTimeout);
    };
  }, [editor, onSave]);

  const handleManualSave = useCallback(async () => {
    if (!editor || !onSave) return;

    setIsSaving(true);
    try {
      const content = editor.getHTML();
      await onSave(content);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar el contrato');
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave]);

  // Show loading state until editor, user, and provider are ready
  if (!editor || !currentUser || !provider) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-sm text-gray-500">Conectando al editor colaborativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Presence Bar */}
      <EditorPresenceBar
        collaborators={collaborators}
        currentUserId={currentUser.id}
        maxCollaborators={maxCollaborators}
      />

      {/* Toolbar */}
      {!readOnly && <EditorToolbar editor={editor} />}

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-8 focus:outline-none"
        />
      </div>

      {/* Save Button */}
      {!readOnly && onSave && (
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
          {isSaving && (
            <span className="text-sm text-gray-500">Guardando...</span>
          )}
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  );
}
