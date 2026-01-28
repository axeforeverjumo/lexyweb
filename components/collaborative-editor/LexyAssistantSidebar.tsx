'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  edit_suggestion?: string | null;
  created_at: string;
}

interface LexyAssistantSidebarProps {
  contractId: string;
  contractContent: string;
  onApplyEdit?: (newContent: string) => void;
}

export default function LexyAssistantSidebar({
  contractId,
  contractContent,
  onApplyEdit,
}: LexyAssistantSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    loadHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`contract-chat:${contractId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contract_chat_history',
          filter: `contract_id=eq.${contractId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contractId, supabase]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_chat_history')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      setMessages(data || []);
    } catch (err: any) {
      console.error('Error loading chat history:', err);
      setError('Error al cargar el historial');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude/contract-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          message: userMessage,
          contractContent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al procesar la solicitud');
      }

      const data = await response.json();

      // Messages are automatically added via real-time subscription
      // But we can manually add them if real-time fails
      await loadHistory();
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Error al comunicarse con Lexy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyEdit = (editSuggestion: string) => {
    if (onApplyEdit) {
      onApplyEdit(editSuggestion);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-indigo-200 bg-white">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Lexy Assistant</h2>
          <p className="text-xs text-gray-500">Asistente legal IA</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Hola, soy Lexy tu asistente legal
            </p>
            <p className="text-xs text-gray-500">
              Puedo ayudarte a:
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>Explicar cláusulas del contrato</li>
              <li>Editar términos específicos</li>
              <li>Sugerir mejoras legales</li>
              <li>Responder dudas jurídicas</li>
            </ul>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

              {/* Edit suggestion button */}
              {msg.role === 'assistant' && msg.edit_suggestion && (
                <button
                  onClick={() => handleApplyEdit(msg.edit_suggestion!)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-sm font-medium text-green-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aplicar cambios al contrato
                </button>
              )}

              <p
                className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                }`}
              >
                {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg p-3 bg-white border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Lexy está pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Pregunta a Lexy sobre el contrato..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
