'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Users, Share2, Crown } from 'lucide-react';
import ConversationItem from './ConversationItem';
import BackToDashboard from '@/components/layout/BackToDashboard';
import NotificationBell from '@/components/notifications/NotificationBell';
import ManageTeamModal from '@/components/organizations/ManageTeamModal';
import type { Profile, Organization } from '@/types/subscription.types';
import type { ConversacionConStats } from '@/types/conversacion.types';

interface ConversacionExtended extends ConversacionConStats {
  is_shared?: boolean;
  is_organization_chat?: boolean;
  organization_id?: string | null;
  participants?: Array<{
    user_id: string;
    role: string;
    user?: Profile;
  }>;
}

export default function ConversationsSidebarV2() {
  const {
    conversaciones,
    conversacionActiva,
    setConversacionActiva,
    crearConversacion,
    fetchConversaciones,
  } = useChatStore();

  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);

  // Cargar perfil de usuario
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Cargar conversaciones al montar
  useEffect(() => {
    fetchConversaciones();
  }, [fetchConversaciones]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const { profile } = await response.json();
        setUserProfile(profile);

        // Si pertenece a organización, obtener datos
        if (profile.organization_id) {
          const orgResponse = await fetch(`/api/organizations/${profile.organization_id}`);
          if (orgResponse.ok) {
            const { organization, members } = await orgResponse.json();
            setOrganization(organization);
            setTeamMembers(members);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Separar conversaciones por tipo
  const myChats = (conversaciones as ConversacionExtended[]).filter(
    (c) => !c.is_organization_chat && c.user_id === userProfile?.id
  );

  const sharedChats = (conversaciones as ConversacionExtended[]).filter(
    (c) => c.is_shared && !c.is_organization_chat && c.user_id !== userProfile?.id
  );

  const teamChats = (conversaciones as ConversacionExtended[]).filter(
    (c) => c.is_organization_chat && c.organization_id
  );

  // Aplicar búsqueda
  const filterBySearch = (convs: ConversacionExtended[]) => {
    if (!search) return convs;
    return convs.filter((c) => c.titulo.toLowerCase().includes(search.toLowerCase()));
  };

  const myChatsFiltered = filterBySearch(myChats);
  const sharedChatsFiltered = filterBySearch(sharedChats);
  const teamChatsFiltered = filterBySearch(teamChats);

  // Separar fijadas
  const myPinned = myChatsFiltered.filter((c) => c.is_pinned);
  const myRecent = myChatsFiltered.filter((c) => !c.is_pinned).slice(0, 20);

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

  const hasTeamAccess = userProfile?.organization_id && organization;
  const isOwner = userProfile?.is_organization_owner;

  return (
    <>
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
              {isCreating ? 'Creando...' : 'Nueva'}
            </Button>
            {userProfile && <NotificationBell userId={userProfile.id} />}
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

          {/* Team Management Button */}
          {hasTeamAccess && isOwner && (
            <button
              onClick={() => setShowTeamModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all text-sm font-medium text-emerald-900"
            >
              <Crown className="w-4 h-4 text-emerald-600" />
              <span>Gestionar Equipo</span>
            </button>
          )}
        </div>

        {/* Lista de conversaciones */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* MIS CHATS */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
              <span className="mr-2">💬</span>
              Mis Chats
            </h3>

            {/* Fijadas */}
            {myPinned.length > 0 && (
              <>
                <div className="space-y-1 mb-3">
                  {myPinned.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversacion={conv}
                      isActive={conv.id === conversacionActiva}
                      onClick={() => setConversacionActiva(conv.id)}
                    />
                  ))}
                </div>
                {myRecent.length > 0 && <Separator className="my-3" />}
              </>
            )}

            {/* Recientes */}
            {myRecent.length > 0 && (
              <div className="space-y-1">
                {myRecent.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversacion={conv}
                    isActive={conv.id === conversacionActiva}
                    onClick={() => setConversacionActiva(conv.id)}
                  />
                ))}
              </div>
            )}

            {/* Compartidos conmigo */}
            {sharedChatsFiltered.length > 0 && (
              <>
                <Separator className="my-4" />
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
                  <Share2 className="w-3 h-3 mr-2" />
                  Compartidos Conmigo
                </h4>
                <div className="space-y-1">
                  {sharedChatsFiltered.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversacion={conv}
                      isActive={conv.id === conversacionActiva}
                      onClick={() => setConversacionActiva(conv.id)}
                    />
                  ))}
                </div>
              </>
            )}

            {myChatsFiltered.length === 0 && sharedChatsFiltered.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-600">
                  {search ? 'No se encontraron chats' : 'No hay chats personales'}
                </p>
              </div>
            )}
          </div>

          {/* CHATS DE EQUIPO */}
          {hasTeamAccess && (
            <>
              <Separator className="my-2" />
              <div className="p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
                  <Users className="w-3 h-3 mr-2" />
                  Chats de Equipo
                  {organization && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                      {organization.name}
                    </span>
                  )}
                </h3>

                {teamChatsFiltered.length > 0 ? (
                  <div className="space-y-1">
                    {teamChatsFiltered.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conversacion={conv}
                        isActive={conv.id === conversacionActiva}
                        onClick={() => setConversacionActiva(conv.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-600">
                      {search ? 'No se encontraron chats' : 'No hay chats de equipo'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty state total */}
          {myChatsFiltered.length === 0 &&
            sharedChatsFiltered.length === 0 &&
            teamChatsFiltered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  {search ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
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

      {/* Team Management Modal */}
      {showTeamModal && organization && (
        <ManageTeamModal
          organization={organization}
          members={teamMembers}
          currentUserId={userProfile!.id}
          onClose={() => setShowTeamModal(false)}
          onUpdate={fetchUserProfile}
        />
      )}
    </>
  );
}
