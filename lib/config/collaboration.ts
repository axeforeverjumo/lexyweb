/**
 * Collaborative Editing Configuration
 *
 * Configure WebSocket providers for Yjs collaborative editing.
 * Switch between different providers based on availability and needs.
 */

export type CollaborationMode = 'websocket' | 'fallback' | 'disabled';

export interface CollaborationConfig {
  mode: CollaborationMode;
  websocketUrl?: string;
  fallbackToLocal?: boolean;
  maxCollaborators: number;
  heartbeatInterval: number; // milliseconds
  autoSaveInterval: number; // milliseconds
}

/**
 * Available WebSocket providers for Yjs
 *
 * PUBLIC SERVERS (for testing only):
 * - demos.yjs.dev - Official Yjs demo server (often unreliable)
 * - y-demos.vercel.app - Alternative demo server
 *
 * PRODUCTION OPTIONS:
 * - Self-hosted y-websocket server (recommended)
 * - Liveblocks (commercial, managed)
 * - PartyKit (commercial, edge-based)
 *
 * FALLBACK MODE:
 * - Disables real-time collaboration
 * - Uses local Yjs document only
 * - Still provides rich editing with auto-save
 */
const WEBSOCKET_PROVIDERS = {
  // Default: use fallback mode (no real-time sync)
  fallback: undefined,

  // Option A: Official Yjs demo (unreliable, for testing only)
  demo: 'wss://demos.yjs.dev',

  // Option B: Alternative demo server
  altDemo: 'wss://y-demos.vercel.app',

  // Option C: Local server (you need to run y-websocket server)
  local: 'ws://localhost:1234',

  // Option D: Your production server (set via env var)
  production: process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL,
};

/**
 * Get current collaboration configuration
 */
export function getCollaborationConfig(): CollaborationConfig {
  // Check environment variable for mode override
  const envMode = process.env.NEXT_PUBLIC_COLLABORATION_MODE as CollaborationMode;

  // Default to fallback mode (safest, no external dependencies)
  const mode: CollaborationMode = envMode || 'fallback';

  // Select WebSocket URL based on mode
  let websocketUrl: string | undefined;

  if (mode === 'websocket') {
    // Priority: production > local > altDemo > demo
    websocketUrl =
      WEBSOCKET_PROVIDERS.production ||
      WEBSOCKET_PROVIDERS.altDemo ||
      WEBSOCKET_PROVIDERS.demo;
  }

  return {
    mode,
    websocketUrl,
    fallbackToLocal: true,
    maxCollaborators: 3,
    heartbeatInterval: 30000, // 30 seconds
    autoSaveInterval: 2000, // 2 seconds
  };
}

/**
 * Check if real-time collaboration is enabled
 */
export function isCollaborationEnabled(): boolean {
  const config = getCollaborationConfig();
  return config.mode === 'websocket' && !!config.websocketUrl;
}

/**
 * Get collaboration status message for UI
 */
export function getCollaborationStatus(): string {
  const config = getCollaborationConfig();

  switch (config.mode) {
    case 'websocket':
      return config.websocketUrl
        ? 'Colaboración en tiempo real activa'
        : 'Servidor de colaboración no disponible';
    case 'fallback':
      return 'Modo editor local (sin colaboración en tiempo real)';
    case 'disabled':
      return 'Colaboración deshabilitada';
    default:
      return 'Modo desconocido';
  }
}
