import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ContractEditorWithLexy from '@/components/collaborative-editor/ContractEditorWithLexy';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Obtener contrato
  const { data: contract, error: contractError } = await supabase
    .from('contract_generations')
    .select('*')
    .eq('id', id)
    .single();

  if (contractError || !contract) {
    redirect('/contratos');
  }

  // Verificar permisos (owner o colaborador)
  const { data: collaborator } = await supabase
    .from('contract_collaborators')
    .select('role')
    .eq('contract_id', id)
    .eq('user_id', user.id)
    .single();

  const isOwner = contract.user_id === user.id;
  const isCollaborator = !!collaborator;

  if (!isOwner && !isCollaborator) {
    redirect('/contratos');
  }

  // Determinar si es solo lectura
  const readOnly = collaborator?.role === 'viewer';

  return (
    <div className="h-screen w-full">
      <ContractEditorWithLexy
        contractId={contract.id}
        initialContent={contract.contenido_markdown || '# Nuevo Contrato\n\nComienza a escribir aquí...'}
        maxCollaborators={3}
        readOnly={readOnly}
      />
    </div>
  );
}
