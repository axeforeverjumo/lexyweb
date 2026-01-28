/**
 * Types for collaborative editor
 */

export interface CollaboratorPresence {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  color: string;
  cursor_position?: { line: number; column: number };
  last_seen: number;
}

export interface EditorUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

// Yjs Awareness state structure
export interface AwarenessUser {
  id: string;
  name: string;
  email: string;
  color: string;
  avatar_url: string | null;
}

export interface AwarenessState {
  user: AwarenessUser;
  cursor: {
    anchor: number;
    head: number;
  } | null;
}

export interface CollaborativeEditorProps {
  contractId: string;
  initialContent: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => Promise<void>;
  maxCollaborators?: number;
  readOnly?: boolean;
}

export interface EditorToolbarProps {
  editor: any; // Tiptap Editor instance
}

export interface EditorPresenceBarProps {
  collaborators: CollaboratorPresence[];
  currentUserId: string;
  maxCollaborators: number;
}

export interface EditorCursorProps {
  name: string;
  color: string;
  position: { x: number; y: number };
}

// User colors for collaborative editing
export const USER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Coral
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky
] as const;

export type UserColor = typeof USER_COLORS[number];

export function getRandomColor(): UserColor {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export function getUserColor(userId: string): UserColor {
  // Deterministic color based on userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}
