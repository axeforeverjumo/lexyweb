'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useChatStore } from '@/lib/store/chatStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  MoreVertical,
  Pin,
  PinOff,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react';
import type { ConversacionConStats } from '@/types/conversacion.types';

interface ConversationItemProps {
  conversacion: ConversacionConStats;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversacion,
  isActive,
  onClick,
}: ConversationItemProps) {
  const { actualizarConversacion, eliminarConversacion, togglePin } =
    useChatStore();

  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState(conversacion.titulo);

  // Formatear fecha relativa
  const timeAgo = formatDistanceToNow(new Date(conversacion.last_message_at), {
    addSuffix: true,
    locale: es,
  });

  // Handler para renombrar
  const handleRename = async () => {
    if (titulo.trim() && titulo !== conversacion.titulo) {
      await actualizarConversacion(conversacion.id, { titulo });
    }
    setIsEditing(false);
  };

  // Handler para eliminar
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta conversación?')) {
      await eliminarConversacion(conversacion.id);
    }
  };

  // Handler para toggle pin
  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await togglePin(conversacion.id);
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative p-3 rounded-lg cursor-pointer transition-all duration-300
        ${
          isActive
            ? 'bg-emerald-500/10 border border-emerald-500/30 shadow-md'
            : 'hover:bg-gray-50 hover:border-emerald-500/20 hover:shadow-lg hover:scale-[1.02] border border-transparent'
        }
      `}
    >
      {/* Título */}
      {isEditing ? (
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') {
              setTitulo(conversacion.titulo);
              setIsEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          className="h-6 text-sm font-medium mb-1"
        />
      ) : (
        <div className="flex items-start justify-between mb-1">
          <h4
            className={`text-sm font-medium line-clamp-1 flex-1 transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-900 group-hover:text-emerald-600'
            }`}
          >
            {conversacion.titulo}
          </h4>

          {/* Menú de acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Renombrar
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleTogglePin}>
                {conversacion.is_pinned ? (
                  <>
                    <PinOff className="w-4 h-4 mr-2" />
                    Desfijar
                  </>
                ) : (
                  <>
                    <Pin className="w-4 h-4 mr-2" />
                    Fijar
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {/* Badge de tipo */}
        {conversacion.tipo === 'contrato' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-medium">
            <FileText className="w-3 h-3 mr-1" />
            Contrato
          </span>
        )}

        {/* Pin badge */}
        {conversacion.is_pinned && <Pin className="w-3 h-3" />}

        {/* Tiempo */}
        <span className="flex-1 truncate">{timeAgo}</span>
      </div>

      {/* Preview último mensaje */}
      {conversacion.ultimo_mensaje_preview && (
        <p className="text-xs text-slate-600 line-clamp-1 mt-1">
          {conversacion.ultimo_mensaje_preview}
        </p>
      )}

      {/* Color indicator */}
      {conversacion.color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: conversacion.color }}
        />
      )}
    </div>
  );
}
