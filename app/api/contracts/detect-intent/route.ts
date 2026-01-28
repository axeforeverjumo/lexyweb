import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CONTRACT_INTENT_DETECTOR_PROMPT,
  parseIntentDetection,
  type ContractIntentDetection,
} from '@/lib/gemini/prompts/contract-intent-detector';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface DetectIntentRequest {
  lastResponse: string;
  conversacionId?: string;
}

/**
 * POST /api/contracts/detect-intent
 *
 * Analiza la última respuesta de Gemini para detectar si:
 * - Se mencionó la necesidad de un contrato
 * - Se recomendó formalizar algo por escrito
 * - El usuario preguntó explícitamente por un contrato
 *
 * Retorna un objeto ContractIntentDetection con:
 * - needsContract: boolean
 * - confidence: 0.0-1.0
 * - contractType: string | null
 * - userExplicitRequest: boolean
 * - reasoning: string
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: DetectIntentRequest = await request.json();
    const { lastResponse } = body;

    if (!lastResponse || lastResponse.trim() === '') {
      return NextResponse.json(
        { error: 'lastResponse es requerido' },
        { status: 400 }
      );
    }

    // Llamar a Gemini con el prompt de detección de intención
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fullPrompt = `${CONTRACT_INTENT_DETECTOR_PROMPT}

---

**MI ÚLTIMA RESPUESTA AL USUARIO:**

"${lastResponse}"

---

**ANALIZA AHORA MI RESPUESTA Y RESPONDE CON EL JSON:**`;

    console.log('[Detect Intent] Analyzing response for contract intent...');
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const detectionText = response.text();

    console.log('[Detect Intent] Raw detection:', detectionText);

    // Parsear la detección
    const detection = parseIntentDetection(detectionText);

    console.log('[Detect Intent] Parsed detection:', {
      needsContract: detection.needsContract,
      confidence: detection.confidence,
      contractType: detection.contractType,
      userExplicitRequest: detection.userExplicitRequest,
    });

    return NextResponse.json(detection, { status: 200 });
  } catch (error) {
    console.error('Error detecting contract intent:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
