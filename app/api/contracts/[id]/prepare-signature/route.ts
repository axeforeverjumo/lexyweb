import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

interface PrepareSignatureBody {
  email_cliente: string;
  email_contraparte: string;
  telefono_cliente: string;
  telefono_contraparte: string;
}

// Generar token aleatorio de 32 caracteres
function generateToken(): string {
  return randomBytes(24).toString('base64url').substring(0, 32);
}

// Generar PIN de 6 dígitos
function generatePIN(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const contractId = resolvedParams.id;

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Parsear body
    const body: PrepareSignatureBody = await request.json();
    const { email_cliente, email_contraparte, telefono_cliente, telefono_contraparte } = body;

    // Validar campos requeridos
    if (!email_cliente || !email_contraparte || !telefono_cliente || !telefono_contraparte) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: emails y teléfonos de ambas partes' },
        { status: 400 }
      );
    }

    // Verificar que el contrato existe y pertenece al usuario
    const { data: contract, error: contractError } = await supabase
      .from('contract_generations')
      .select('id, user_id, estado, titulo')
      .eq('id', contractId)
      .eq('user_id', user.id)
      .single();

    if (contractError || !contract) {
      return NextResponse.json(
        { error: 'Contrato no encontrado o no tienes permisos' },
        { status: 404 }
      );
    }

    // Verificar que el contrato no esté ya en proceso de firma o firmado
    if (contract.estado === 'pendiente_firma' || contract.estado === 'firmado') {
      return NextResponse.json(
        { error: `El contrato ya está en estado: ${contract.estado}` },
        { status: 400 }
      );
    }

    console.log('[Prepare Signature] Generating signature credentials for contract:', contractId);

    // Generar token y PINs directamente en JavaScript (SIMPLE!)
    const token = generateToken();
    const pinCliente = generatePIN();
    const pinContraparte = generatePIN();

    // Actualizar el contrato con los datos de firma
    const { error: updateError } = await supabase
      .from('contract_generations')
      .update({
        firma_token: token,
        firma_pin_cliente: pinCliente,
        firma_pin_contraparte: pinContraparte,
        email_cliente,
        email_contraparte,
        telefono_cliente,
        telefono_contraparte,
        estado: 'pendiente_firma',
      })
      .eq('id', contractId);

    if (updateError) {
      console.error('[Prepare Signature] Error updating contract:', updateError);
      return NextResponse.json(
        { error: 'Error al preparar el contrato para firma' },
        { status: 500 }
      );
    }

    // Construir el link de firma
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const linkFirma = `${baseUrl}/contratos/${contractId}/firmar/${token}`;

    console.log('[Prepare Signature] Signature prepared successfully:', {
      contractId,
      token: token.substring(0, 8) + '...',
      linkFirma,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        pin_cliente: pinCliente,
        pin_contraparte: pinContraparte,
        link_firma: linkFirma,
        contract: {
          id: contract.id,
          titulo: contract.titulo,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Prepare Signature] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Error inesperado al preparar la firma',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
