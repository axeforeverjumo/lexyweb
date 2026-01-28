'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Save, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  editSuggestion?: string | null;
  appliedAutomatically?: boolean;
}

interface ContractCanvasSidebarProps {
  contractId: string;
  contractContent: string;
  conversacionId: string | null;
  onApplyEdit: (newContent: string, changedText?: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ContractCanvasSidebar({
  contractId,
  contractContent,
  conversacionId,
  onApplyEdit,
  onSave,
  isSaving,
}: ContractCanvasSidebarProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hola, soy **Lexy**, tu asistente legal. Puedo ayudarte con:\n\n- **Consultas**: Explico cláusulas, términos legales, obligaciones\n- **Ediciones en vivo**: Dime qué cambiar y lo aplico automáticamente\n- **Consejos**: Recomiendo mejoras y advierto sobre riesgos\n\n¿En qué puedo ayudarte?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar historial de chat al montar el componente
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(`/api/chat/contract/${contractId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Si hay historial, reemplazar el mensaje de bienvenida
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Si falla, mantener el mensaje de bienvenida por defecto
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [contractId]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Añadir mensaje del usuario
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      // Llamar al endpoint (el API carga el historial desde BD)
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
        throw new Error('Error al consultar a Lexy');
      }

      const data = await response.json();

      // Si hay sugerencia de edición, aplicarla automáticamente
      const appliedAutomatically = !!data.editSuggestion;
      if (data.editSuggestion) {
        // Pasar el contenido nuevo Y el texto que cambió (para highlight)
        onApplyEdit(data.editSuggestion, data.changedText || null);
        setHasUnsavedChanges(true);
      }

      // Añadir respuesta del asistente
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        editSuggestion: data.editSuggestion,
        appliedAutomatically,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Error al procesar tu solicitud. Intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSave = () => {
    onSave();
    setHasUnsavedChanges(false);
  };

  return (
    <div className="w-[450px] bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-semibold text-slate-900">Canvas de Edición</h2>
              <p className="text-xs text-slate-600">Lexy edita en tiempo real</p>
            </div>
          </div>
          <button
            onClick={() => {
              // Si hay conversación específica, volver a ella. Si no, al chat general
              if (conversacionId) {
                router.push(`/abogado?c=${conversacionId}`);
              } else {
                router.push('/abogado');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-700 bg-white hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Chat
          </button>
        </div>
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}

              {/* Indicador de cambio aplicado automáticamente */}
              {msg.appliedAutomatically && (
                <div className="mt-2 flex items-center gap-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  <Check className="w-3 h-3" />
                  ✨ Cambio aplicado automáticamente
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-slate-600">Lexy está pensando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta o pide un cambio..."
            className="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg px-4 transition-colors flex items-center justify-center self-end"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Enter para enviar • Shift+Enter para nueva línea
        </p>
        <p className="text-xs text-blue-600 mt-1 font-medium">
          💡 Los cambios se aplican automáticamente al documento
        </p>
      </div>
    </div>
  );
}
