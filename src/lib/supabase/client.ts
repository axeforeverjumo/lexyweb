'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';

export const createClient = (): SupabaseClient => {
  return createClientComponentClient();
};
