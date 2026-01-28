/**
 * Zustand Store para gestión del chat con IA
 */

import { create } from 'zustand';
import type {
  Conversacion,
  ConversacionConStats,
  CreateConversacionInput,
  UpdateConversacionInput,
} from '@/types/conversacion.types';
import type { Mensaje } from '@/types/mensaje.types';

interface ChatStore {
  // Estado
  conversaciones: ConversacionConStats[];
  conversacionActiva: string | null;
  mensajes: Mensaje[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;

  // Acciones - Conversaciones
  fetchConversaciones: () => Promise<void>;
  setConversacionActiva: (id: string | null) => void;
  crearConversacion: (data: CreateConversacionInput) => Promise<string>;
  actualizarConversacion: (
    id: string,
    data: UpdateConversacionInput
  ) => Promise<void>;
  eliminarConversacion: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;

  // Acciones - Mensajes
  fetchMensajes: (conversacionId: string) => Promise<void>;
  enviarMensaje: (conversacionId: string, contenido: string, role?: 'user' | 'assistant' | 'system') => Promise<void>;
  addMensaje: (mensaje: Mensaje) => void;
  clearMensajes: () => void;

  // Utilidades
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Estado inicial
  conversaciones: [],
  conversacionActiva: null,
  mensajes: [],
  isLoading: false,
  isTyping: false,
  error: null,

  // Fetch conversaciones
  fetchConversaciones: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/conversaciones');
      if (!response.ok) throw new Error('Error al obtener conversaciones');

      const { conversaciones } = await response.json();
      set({ conversaciones, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // Establecer conversación activa
  setConversacionActiva: (id) => {
    set({ conversacionActiva: id });
    if (id) {
      get().fetchMensajes(id);
    } else {
      set({ mensajes: [] });
    }
  },

  // Crear conversación
  crearConversacion: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/conversaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al crear conversación');

      const { conversacion } = await response.json();

      // Agregar a lista
      set((state) => ({
        conversaciones: [conversacion, ...state.conversaciones],
        conversacionActiva: conversacion.id,
        isLoading: false,
      }));

      return conversacion.id;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
      throw error;
    }
  },

  // Actualizar conversación
  actualizarConversacion: async (id, data) => {
    try {
      const response = await fetch(`/api/conversaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al actualizar conversación');

      const { conversacion } = await response.json();

      // Actualizar en lista
      set((state) => ({
        conversaciones: state.conversaciones.map((c) =>
          c.id === id ? { ...c, ...conversacion } : c
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
      throw error;
    }
  },

  // Eliminar conversación
  eliminarConversacion: async (id) => {
    try {
      const response = await fetch(`/api/conversaciones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar conversación');

      // Remover de lista
      set((state) => ({
        conversaciones: state.conversaciones.filter((c) => c.id !== id),
        conversacionActiva:
          state.conversacionActiva === id ? null : state.conversacionActiva,
        mensajes: state.conversacionActiva === id ? [] : state.mensajes,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
      throw error;
    }
  },

  // Toggle pin
  togglePin: async (id) => {
    const conversacion = get().conversaciones.find((c) => c.id === id);
    if (!conversacion) return;

    await get().actualizarConversacion(id, {
      is_pinned: !conversacion.is_pinned,
    });
  },

  // Fetch mensajes
  fetchMensajes: async (conversacionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/conversaciones/${conversacionId}/mensajes`
      );
      if (!response.ok) throw new Error('Error al obtener mensajes');

      const { mensajes } = await response.json();
      set({ mensajes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // Enviar mensaje
  enviarMensaje: async (conversacionId, contenido, role = 'user') => {
    // Si es un mensaje de sistema o asistente, solo agregarlo sin llamar API
    if (role === 'system' || role === 'assistant') {
      const mensaje: Mensaje = {
        id: crypto.randomUUID(),
        conversacion_id: conversacionId,
        role,
        content: contenido,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        mensajes: [...state.mensajes, mensaje],
      }));

      return;
    }

    // Si es mensaje de usuario, proceder normalmente
    set({ isTyping: true, error: null });

    try {
      // Agregar mensaje del usuario optimísticamente
      const mensajeUsuario: Mensaje = {
        id: crypto.randomUUID(),
        conversacion_id: conversacionId,
        role: 'user',
        content: contenido,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        mensajes: [...state.mensajes, mensajeUsuario],
      }));

      // Llamar API de Gemini
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversacion_id: conversacionId,
          mensaje: contenido,
        }),
      });

      if (!response.ok) throw new Error('Error al enviar mensaje');

      const { respuesta, suggested_contract } = await response.json();

      // Agregar respuesta de la IA
      const mensajeIA: Mensaje = {
        id: crypto.randomUUID(),
        conversacion_id: conversacionId,
        role: 'assistant',
        content: respuesta,
        metadata: suggested_contract ? { suggested_contract } : undefined,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        mensajes: [...state.mensajes, mensajeIA],
        isTyping: false,
      }));

      // Actualizar last_message_at en conversación
      set((state) => ({
        conversaciones: state.conversaciones.map((c) =>
          c.id === conversacionId
            ? { ...c, last_message_at: new Date().toISOString() }
            : c
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isTyping: false,
      });
      throw error;
    }
  },

  // Agregar mensaje manualmente
  addMensaje: (mensaje) => {
    set((state) => ({
      mensajes: [...state.mensajes, mensaje],
    }));
  },

  // Limpiar mensajes
  clearMensajes: () => {
    set({ mensajes: [] });
  },

  // Utilidades
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
