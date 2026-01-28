'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (mensaje: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [mensaje, setMensaje] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [mensaje]);

  // Handler para enviar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensaje.trim() && !disabled) {
      onSend(mensaje.trim());
      setMensaje('');
    }
  };

  // Handler para Enter (enviar) y Shift+Enter (nueva línea)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        ref={textareaRef}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu consulta legal... (Shift+Enter para nueva línea)"
        disabled={disabled}
        className="min-h-[60px] max-h-[200px] resize-none"
        rows={2}
      />

      <Button
        type="submit"
        disabled={!mensaje.trim() || disabled}
        className="flex-shrink-0 h-[60px] w-[60px]"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}
