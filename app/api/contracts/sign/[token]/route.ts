import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface SignContractBody {
  pin: string;
  signature: string; // base64
  role: 'cliente' | 'contraparte';
}

/**
 * GET /api/contracts/sign/[token]?pin=123456
 * Valida el token y PIN, devuelve info del contrato
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const token = resolvedParams.token;

    // Obtener PIN de query params
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get('pin');

    if (!pin) {
      return NextResponse.json(
        { error: 'PIN requerido en query params' },
        { status: 400 }
      );
    }

    console.log('[Sign Contract] Validating token and PIN');

    // Buscar el contrato por token
    const { data: contract, error: contractError } = await supabase
      .from('contract_generations')
      .select('id, titulo, contenido_markdown, estado, firma_pin_cliente, firma_pin_contraparte, firma_cliente, firma_contraparte, tipo_contrato')
      .eq('firma_token', token)
      .single();

    if (contractError || !contract) {
      console.error('[Sign Contract] Contract not found for token:', contractError);
      return NextResponse.json(
        { error: 'Token inválido o contrato no encontrado' },
        { status: 404 }
      );
    }

    // Validar que el contrato esté en estado pendiente_firma
    if (contract.estado !== 'pendiente_firma') {
      return NextResponse.json(
        { error: `El contrato no está pendiente de firma. Estado actual: ${contract.estado}` },
        { status: 400 }
      );
    }

    // Determinar el rol según el PIN
    let role: 'cliente' | 'contraparte' | null = null;
    let alreadySigned = false;

    if (pin === contract.firma_pin_cliente) {
      role = 'cliente';
      alreadySigned = !!contract.firma_cliente;
    } else if (pin === contract.firma_pin_contraparte) {
      role = 'contraparte';
      alreadySigned = !!contract.firma_contraparte;
    } else {
      console.error('[Sign Contract] Invalid PIN provided');
      return NextResponse.json(
        { error: 'PIN incorrecto' },
        { status: 401 }
      );
    }

    console.log('[Sign Contract] PIN validated successfully:', {
      contractId: contract.id,
      role,
      alreadySigned,
    });

    return NextResponse.json(
      {
        success: true,
        contract: {
          id: contract.id,
          titulo: contract.titulo,
          contenido_markdown: contract.contenido_markdown,
          tipo_contrato: contract.tipo_contrato,
        },
        role,
        already_signed: alreadySigned,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Sign Contract] Unexpected error in GET:', error);
    return NextResponse.json(
      {
        error: 'Error al validar el token',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contracts/sign/[token]
 * Guarda la firma del firmante
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const token = resolvedParams.token;

    // Parsear body
    const body: SignContractBody = await request.json();
    const { pin, signature, role } = body;

    // Validar campos requeridos
    if (!pin || !signature || !role) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: pin, signature, role' },
        { status: 400 }
      );
    }

    if (role !== 'cliente' && role !== 'contraparte') {
      return NextResponse.json(
        { error: 'Role debe ser "cliente" o "contraparte"' },
        { status: 400 }
      );
    }

    console.log('[Sign Contract] Processing signature for role:', role);

    // Buscar el contrato por token
    const { data: contract, error: contractError } = await supabase
      .from('contract_generations')
      .select('id, estado, firma_pin_cliente, firma_pin_contraparte, firma_cliente, firma_contraparte, user_id')
      .eq('firma_token', token)
      .single();

    if (contractError || !contract) {
      console.error('[Sign Contract] Contract not found for token:', contractError);
      return NextResponse.json(
        { error: 'Token inválido o contrato no encontrado' },
        { status: 404 }
      );
    }

    // Validar que el contrato esté en estado pendiente_firma
    if (contract.estado !== 'pendiente_firma') {
      return NextResponse.json(
        { error: `El contrato no está pendiente de firma. Estado actual: ${contract.estado}` },
        { status: 400 }
      );
    }

    // Validar PIN según el rol
    if (role === 'cliente' && pin !== contract.firma_pin_cliente) {
      return NextResponse.json({ error: 'PIN incorrecto para cliente' }, { status: 401 });
    }

    if (role === 'contraparte' && pin !== contract.firma_pin_contraparte) {
      return NextResponse.json({ error: 'PIN incorrecto para contraparte' }, { status: 401 });
    }

    // Verificar si ya firmó
    if (role === 'cliente' && contract.firma_cliente) {
      return NextResponse.json(
        { error: 'El cliente ya ha firmado este contrato' },
        { status: 400 }
      );
    }

    if (role === 'contraparte' && contract.firma_contraparte) {
      return NextResponse.json(
        { error: 'La contraparte ya ha firmado este contrato' },
        { status: 400 }
      );
    }

    // Preparar actualización
    const updateData: any = {};

    if (role === 'cliente') {
      updateData.firma_cliente = signature;
    } else {
      updateData.firma_contraparte = signature;
    }

    // Verificar si ambas partes han firmado
    const bothSigned =
      (role === 'cliente' && contract.firma_contraparte) ||
      (role === 'contraparte' && contract.firma_cliente);

    // Si ambas partes firmaron, cambiar estado a 'firmado'
    if (bothSigned) {
      updateData.estado = 'firmado';
      console.log('[Sign Contract] Both parties signed, changing status to "firmado"');
    }

    // Actualizar el contrato
    const { error: updateError } = await supabase
      .from('contract_generations')
      .update(updateData)
      .eq('id', contract.id);

    if (updateError) {
      console.error('[Sign Contract] Error updating contract:', updateError);
      return NextResponse.json(
        { error: 'Error al guardar la firma' },
        { status: 500 }
      );
    }

    console.log('[Sign Contract] Signature saved successfully:', {
      contractId: contract.id,
      role,
      bothSigned,
    });

    // TODO: Enviar email de notificación al usuario si ambas partes firmaron
    // if (bothSigned) {
    //   await sendEmailNotification(contract.user_id, contract.id);
    // }

    return NextResponse.json(
      {
        success: true,
        both_signed: bothSigned,
        message: bothSigned
          ? 'Firma guardada. ¡Contrato completado! Ambas partes han firmado.'
          : 'Firma guardada correctamente. Esperando firma de la otra parte.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Sign Contract] Unexpected error in POST:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la firma',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
