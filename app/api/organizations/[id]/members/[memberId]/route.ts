/**
 * API Route para eliminar miembro de organización
 * DELETE /api/organizations/[id]/members/[memberId]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const organizationId = params.id;
    const memberId = params.memberId;

    // Verificar que el usuario es el owner
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('owner_id')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    if (organization.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar miembros' },
        { status: 403 }
      );
    }

    // No puede eliminar al owner
    if (memberId === organization.owner_id) {
      return NextResponse.json(
        { error: 'No puedes eliminar al propietario' },
        { status: 400 }
      );
    }

    // Actualizar perfil del miembro (remover de organización)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        organization_id: null,
        subscription_status: 'inactive',
        subscription_tier: 'none',
      })
      .eq('id', memberId)
      .eq('organization_id', organizationId);

    if (profileError) {
      console.error('Error al actualizar perfil:', profileError);
      return NextResponse.json(
        { error: 'Error al eliminar miembro' },
        { status: 500 }
      );
    }

    // Notificar al miembro eliminado
    await supabase.from('notifications').insert({
      user_id: memberId,
      type: 'system',
      title: 'Eliminado del equipo',
      message: 'Has sido eliminado de la organización',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/organizations/[id]/members/[memberId]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
