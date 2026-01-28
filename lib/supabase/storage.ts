import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Sube un PDF al bucket de Supabase Storage
 */
export async function uploadPDF(
  supabase: SupabaseClient,
  userId: string,
  contractId: string,
  file: File
): Promise<{ path: string; url: string }> {
  const fileExt = 'pdf';
  const fileName = `${contractId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('contratos-pdfs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Error uploading PDF: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('contratos-pdfs')
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: publicUrl,
  };
}

/**
 * Sube un PDF firmado al bucket de Supabase Storage
 */
export async function uploadSignedPDF(
  supabase: SupabaseClient,
  userId: string,
  contractId: string,
  blob: Blob
): Promise<{ path: string; url: string }> {
  const fileName = `${contractId}-firmado.pdf`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('contratos-firmados')
    .upload(filePath, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'application/pdf',
    });

  if (error) {
    throw new Error(`Error uploading signed PDF: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('contratos-firmados')
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: publicUrl,
  };
}

/**
 * Descarga un PDF desde Supabase Storage
 */
export async function downloadPDF(
  supabase: SupabaseClient,
  path: string
): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from('contratos-pdfs')
    .download(path);

  if (error) {
    throw new Error(`Error downloading PDF: ${error.message}`);
  }

  return data;
}

/**
 * Elimina un PDF de Supabase Storage
 */
export async function deletePDF(
  supabase: SupabaseClient,
  path: string
): Promise<void> {
  const { error } = await supabase.storage
    .from('contratos-pdfs')
    .remove([path]);

  if (error) {
    throw new Error(`Error deleting PDF: ${error.message}`);
  }
}
