'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Search } from 'lucide-react';
import ConversationItem from './ConversationItem';
import BackToDashboard from '@/components/layout/BackToDashboard';

export default function ConversationsSidebar() {
  const {
    conversaciones,
    conversacionActiva,
    setConversacionActiva,
    crearConversacion,
    fetchConversaciones,
  } = useChatStore();

  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Cargar conversaciones al montar
  useEffect(() => {
    fetchConversaciones();
  }, [fetchConversaciones]);

  // Filtrar conversaciones por búsqueda
  const conversacionesFiltradas = search
    ? conversaciones.filter((c) =>
        c.titulo.toLowerCase().includes(search.toLowerCase())
      )
    : conversaciones;

  // Separar fijadas y no fijadas
  const fijadas = conversacionesFiltradas.filter((c) => c.is_pinned);
  const recientes = conversacionesFiltradas
    .filter((c) => !c.is_pinned)
    .slice(0, 20);

  // Handler para crear nueva conversación
  const handleNuevaConversacion = async () => {
    setIsCreating(true);
    try {
      const id = await crearConversacion({
        tipo: 'consulta',
        titulo: 'Nueva conversación',
      });
      setConversacionActiva(id);
    } catch (error) {
      console.error('Error al crear conversación:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-white relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2">
          <BackToDashboard />
          <Button
            variant="gradient"
            onClick={handleNuevaConversacion}
            disabled={isCreating}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Creando...' : 'Nueva Conversación'}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar conversaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {/* Fijadas */}
        {fijadas.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
              <span className="mr-2">📌</span>
              Fijadas
            </h3>
            <div className="space-y-1">
              {fijadas.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversacion={conv}
                  isActive={conv.id === conversacionActiva}
                  onClick={() => setConversacionActiva(conv.id)}
                />
              ))}
            </div>
          </div>
        )}

        {fijadas.length > 0 && recientes.length > 0 && (
          <Separator className="my-2" />
        )}

        {/* Recientes */}
        {recientes.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
              <span className="mr-2">📅</span>
              Recientes
            </h3>
            <div className="space-y-1">
              {recientes.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversacion={conv}
                  isActive={conv.id === conversacionActiva}
                  onClick={() => setConversacionActiva(conv.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {conversacionesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">
              {search
                ? 'No se encontraron conversaciones'
                : 'No hay conversaciones'}
            </p>
            <p className="text-xs text-slate-500">
              {search
                ? 'Intenta con otro término de búsqueda'
                : 'Crea una nueva conversación para empezar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
