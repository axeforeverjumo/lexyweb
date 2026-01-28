'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ConversationsSidebarV2 from '@/components/abogado/ConversationsSidebarV2';
import ChatInterface from '@/components/abogado/ChatInterface';
import { useChatStore } from '@/lib/store/chatStore';

function AbogadoContent() {
  const searchParams = useSearchParams();
  const { setConversacionActiva } = useChatStore();

  // Detectar si vienen de un contrato (parámetro ?c=conversacionId)
  useEffect(() => {
    const conversacionId = searchParams.get('c');
    if (conversacionId) {
      setConversacionActiva(conversacionId);
    }
  }, [searchParams, setConversacionActiva]);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] bg-white">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-10 flex w-full">
        {/* Sidebar de conversaciones */}
        <ConversationsSidebarV2 />

        {/* Área de chat */}
        <ChatInterface />
      </div>
    </div>
  );
}

export default function AbogadoPage() {
  return (
    <Suspense fallback={
      <div className="relative flex h-[calc(100vh-4rem)] bg-white items-center justify-center">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    }>
      <AbogadoContent />
    </Suspense>
  );
}
