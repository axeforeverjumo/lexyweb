'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import EditorPresenceBar from './EditorPresenceBar';
import LexyAssistantSidebar from './LexyAssistantSidebar';
import type { CollaboratorPresence } from './types';
import { getUserColor } from './types';

interface ContractEditorWithLexyProps {
  contractId: string;
  initialContent: string;
  maxCollaborators?: number;
  readOnly?: boolean;
}

export default function ContractEditorWithLexy({
  contractId,
  initialContent,
  maxCollaborators = 3,
  readOnly = false,
}: ContractEditorWithLexyProps) {
  const router = useRouter();
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentContent, setCurrentContent] = useState(initialContent);
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

    // TODO: Replace with your WebSocket server URL
    // For now, using a public Yjs server (NOT for production)
    const wsProvider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      `lexy-contract-${contractId}`,
      ydoc,
      {
        params: {
          userId: currentUser.id,
          userName: currentUser.name,
        },
      }
    );

    // Check connected users count before allowing connection
    wsProvider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
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
            email: '',
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
        updateCollaborators();

        return () => {
          awareness.off('change', updateCollaborators);
        };
      }
    });

    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
    };
  }, [contractId, ydoc, currentUser, maxCollaborators]);

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

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [contractId, currentUser, provider]);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider || undefined,
        user: currentUser
          ? {
              name: currentUser.name,
              color: currentUser.color,
            }
          : undefined,
      }),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setCurrentContent(content);
    },
  });

  // Save function for auto-save and manual save
  const handleSave = useCallback(async (content: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido_markdown: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar contrato');
      }
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [contractId]);

  // Auto-save functionality
  useEffect(() => {
    if (!editor) return;

    let saveTimeout: NodeJS.Timeout;

    const handleUpdate = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        const content = editor.getHTML();
        try {
          await handleSave(content);
        } catch (error) {
          console.error('Error saving:', error);
        }
      }, 2000);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      clearTimeout(saveTimeout);
    };
  }, [editor, handleSave]);

  const handleManualSave = useCallback(async () => {
    if (!editor) return;

    try {
      const content = editor.getHTML();
      await handleSave(content);
    } catch (error) {
      alert('Error al guardar el contrato');
    }
  }, [editor, handleSave]);

  // Lexy apply edit handler - integrates with Yjs editor
  const handleLexyApplyEdit = useCallback((editSuggestion: string) => {
    if (editor) {
      // Replace entire content - Yjs will sync automatically
      editor.commands.setContent(editSuggestion);

      // Manually trigger save
      handleManualSave();
    }
  }, [editor, handleManualSave]);

  if (!editor || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Lexy Assistant Sidebar - 450px left */}
      <div className="w-[450px] border-r border-gray-200 flex-shrink-0 h-full overflow-hidden">
        <LexyAssistantSidebar
          contractId={contractId}
          contractContent={currentContent}
          onApplyEdit={handleLexyApplyEdit}
        />
      </div>

      {/* Collaborative Editor - flex-1 right */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/contratos/${contractId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver al contrato</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900">
                Edición con Lexy
              </h1>
              {readOnly && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                  Solo lectura
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
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
          {!readOnly && (
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
      </div>
    </div>
  );
}
