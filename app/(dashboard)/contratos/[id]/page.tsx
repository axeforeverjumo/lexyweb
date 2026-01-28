import { notFound } from 'next/navigation';
import ContractDetailView from '@/components/contratos/ContractDetailView';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContractDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Obtener el contrato
  const { data: contract, error } = await supabase
    .from('contract_generations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !contract) {
    notFound();
  }

  // Mapear los campos de la base de datos al formato esperado por el componente
  const contractData = {
    id: contract.id,
    titulo: contract.titulo || 'Sin título',
    estado: contract.estado || 'borrador',
    created_at: contract.created_at,
    updated_at: contract.updated_at,
    idioma: contract.idioma || 'es',
    contenido_markdown: contract.contenido_markdown || '',
    contenido_html: contract.contenido_html || '',
    datos_completados: contract.datos_completados || {},
    template_id: contract.template_id,
  };

  return <ContractDetailView contract={contractData} />;
}
