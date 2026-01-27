import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';

export const createClient = async (): Promise<SupabaseClient> => {
  const cookieStore = await cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};
