"use client";

import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useGetPersonnel = () => {
  return useQuery({
    queryKey: ['personnel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};