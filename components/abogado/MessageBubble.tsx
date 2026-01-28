'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Bot } from 'lucide-react';
import type { Mensaje } from '@/types/mensaje.types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  mensaje: Mensaje;
  isContractMode?: boolean;
}

export default function MessageBubble({ mensaje, isContractMode = false }: MessageBubbleProps) {
  const isAssistant = mensaje.role === 'assistant';
  const isSystem = mensaje.role === 'system';

  // No mostrar mensajes de sistema (son instrucciones internas)
  if (isSystem) {
    return null;
  }

  // Formatear tiempo
  const timeAgo = formatDistanceToNow(new Date(mensaje.created_at), {
    addSuffix: true,
    locale: es,
  });

  return (
    <div
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isAssistant ? 'bg-primary' : 'bg-slate-600'}
        `}
      >
        {isAssistant ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Contenido del mensaje */}
      <div className={`flex-1 max-w-3xl ${isAssistant ? '' : 'flex justify-end'}`}>
        <div
          className={`
            rounded-lg px-4 py-3 transition-colors
            ${
              isAssistant
                ? isContractMode
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-slate-900'
                  : 'bg-slate-100 text-slate-900'
                : 'bg-primary text-primary-foreground'
            }
          `}
        >
          {/* Contenido */}
          {isAssistant ? (
            <div className="prose prose-sm max-w-none prose-slate">
              <ReactMarkdown>{mensaje.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{mensaje.content}</p>
          )}

          {/* Timestamp */}
          <p
            className={`text-xs mt-2 ${
              isAssistant ? 'text-slate-500' : 'text-primary-foreground/70'
            }`}
          >
            {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
}
