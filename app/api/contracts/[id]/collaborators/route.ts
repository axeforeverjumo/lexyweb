import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/contracts/[id]/collaborators - Listar colaboradores de un contrato
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: contractId } = await params;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario tiene acceso al contrato (owner o colaborador)
    const { data: contract } = await supabase
      .from('contract_generations')
      .select('id, user_id')
      .eq('id', contractId)
      .single();

    if (!contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    const isOwner = contract.user_id === user.id;

    if (!isOwner) {
      // Verificar si es colaborador
      const { data: collaboration } = await supabase
        .from('contract_collaborators')
        .select('id')
        .eq('contract_id', contractId)
        .eq('user_id', user.id)
        .single();

      if (!collaboration) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
    }

    // Obtener colaboradores con información de perfil
    const { data: collaborators, error: collabError } = await supabase
      .from('contract_collaborators')
      .select(`
        id,
        user_id,
        role,
        status,
        permissions,
        invited_at,
        accepted_at,
        profiles:user_id (
          id,
          email,
          nombre,
          apellidos
        )
      `)
      .eq('contract_id', contractId)
      .order('invited_at', { ascending: false });

    if (collabError) {
      console.error('[Collaborators] Error loading collaborators:', collabError);
      return NextResponse.json(
        { error: 'Error al cargar colaboradores' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        collaborators: collaborators || [],
        isOwner,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Collaborators] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// POST /api/contracts/[id]/collaborators - Invitar colaborador
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: contractId } = await params;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario es el owner del contrato
    const { data: contract } = await supabase
      .from('contract_generations')
      .select('id, user_id')
      .eq('id', contractId)
      .single();

    if (!contract || contract.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Solo el propietario puede invitar colaboradores' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role = 'editor' } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que no es el mismo owner
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'No puedes agregarte como colaborador' },
        { status: 400 }
      );
    }

    // Verificar que el usuario a invitar existe
    const { data: invitedUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (!invitedUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar límite de colaboradores (máximo 3)
    const { count: currentCollaborators } = await supabase
      .from('contract_collaborators')
      .select('id', { count: 'exact', head: true })
      .eq('contract_id', contractId)
      .eq('status', 'accepted');

    if (currentCollaborators && currentCollaborators >= 3) {
      return NextResponse.json(
        { error: 'Máximo 3 colaboradores permitidos por contrato' },
        { status: 400 }
      );
    }

    // Crear invitación
    const { data: collaboration, error: insertError } = await supabase
      .from('contract_collaborators')
      .insert({
        contract_id: contractId,
        user_id: userId,
        invited_by: user.id,
        role,
        status: 'pending',
        permissions: {
          can_edit: role === 'editor',
          can_delete: false,
          can_share: false,
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Collaborators] Error creating invitation:', insertError);

      // Manejar error de duplicado
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Este usuario ya fue invitado' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Error al crear invitación' },
        { status: 500 }
      );
    }

    // TODO: Crear notificación para el usuario invitado

    return NextResponse.json(
      {
        collaboration,
        message: 'Invitación enviada correctamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Collaborators] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
