'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import type { EditorPresenceBarProps } from './types';

export default function EditorPresenceBar({
  collaborators,
  currentUserId,
  maxCollaborators,
}: EditorPresenceBarProps) {
  // Filter out offline users (not seen in last 30 seconds)
  const now = Date.now();
  const activeCollaborators = collaborators.filter(
    (c) => now - c.last_seen < 30000
  );

  // Filter out current user from display (they're already here)
  const otherCollaborators = activeCollaborators.filter(
    (c) => c.user_id !== currentUserId
  );

  // Count includes current user + others
  const totalActive = otherCollaborators.length + 1; // +1 for current user
  const spotsRemaining = maxCollaborators - totalActive;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      {/* Active collaborators */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Editando ahora:</span>

        {otherCollaborators.length === 0 ? (
          <span className="text-sm text-gray-400">Solo tú</span>
        ) : (
          <div className="flex -space-x-2">
            {otherCollaborators.map((collaborator) => (
              <div
                key={collaborator.user_id}
                className="relative group"
                style={{ zIndex: 10 }}
              >
                {collaborator.avatar_url ? (
                  <img
                    src={collaborator.avatar_url}
                    alt={collaborator.full_name}
                    className="w-8 h-8 rounded-full ring-2 ring-white hover:ring-4 transition-all"
                    style={{
                      borderColor: collaborator.color,
                      boxShadow: `0 0 0 2px ${collaborator.color}`,
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-semibold hover:ring-4 transition-all"
                    style={{
                      backgroundColor: collaborator.color,
                      boxShadow: `0 0 0 2px ${collaborator.color}`,
                    }}
                  >
                    {collaborator.full_name[0]?.toUpperCase() || '?'}
                  </div>
                )}

                {/* Active indicator pulse */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white animate-pulse"
                  style={{ backgroundColor: collaborator.color }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {collaborator.full_name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Spots remaining indicator */}
        {spotsRemaining > 0 && (
          <span className="text-xs text-gray-400">
            ({spotsRemaining} {spotsRemaining === 1 ? 'espacio' : 'espacios'}{' '}
            disponible{spotsRemaining !== 1 ? 's' : ''})
          </span>
        )}

        {spotsRemaining === 0 && (
          <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Máximo de colaboradores alcanzado
          </span>
        )}
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-500">En línea</span>
        </div>
      </div>
    </div>
  );
}
