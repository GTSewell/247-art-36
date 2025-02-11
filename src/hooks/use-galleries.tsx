
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gallery } from "@/data/types/gallery";

export const useGalleries = () => {
  return useQuery({
    queryKey: ["galleries"],
    queryFn: async (): Promise<Gallery[]> => {
      const { data, error } = await supabase
        .from("galleries")
        .select("*");

      if (error) throw error;
      return data;
    },
  });
};
