import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SpecificationOption {
  id: string;
  category: string;
  option_value: string;
  usage_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useSpecificationOptions = () => {
  const [options, setOptions] = useState<Record<string, SpecificationOption[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('specification_options')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;

      // Group options by category
      const groupedOptions = data.reduce((acc: Record<string, SpecificationOption[]>, option) => {
        if (!acc[option.category]) {
          acc[option.category] = [];
        }
        acc[option.category].push(option);
        return acc;
      }, {});

      setOptions(groupedOptions);
    } catch (error) {
      console.error('Error fetching specification options:', error);
      toast({
        title: "Error",
        description: "Failed to load specification options",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = async (category: string, optionValue: string) => {
    try {
      const { data, error } = await supabase
        .from('specification_options')
        .upsert({
          category,
          option_value: optionValue,
          usage_count: 1,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'category,option_value',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setOptions(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), data]
          .sort((a, b) => b.usage_count - a.usage_count)
      }));

      return data;
    } catch (error) {
      console.error('Error adding specification option:', error);
      toast({
        title: "Error",
        description: "Failed to add specification option",
        variant: "destructive",
      });
      return null;
    }
  };

  const incrementUsage = async (category: string, optionValue: string) => {
    try {
      // Get current usage count and increment it
      const { data: existing } = await supabase
        .from('specification_options')
        .select('usage_count')
        .match({ category, option_value: optionValue })
        .single();

      if (existing) {
        const { error } = await supabase
          .from('specification_options')
          .update({ usage_count: existing.usage_count + 1 })
          .match({ category, option_value: optionValue });

        if (error) throw error;

        // Refresh options to get updated usage counts
        await fetchOptions();
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return {
    options,
    isLoading,
    addOption,
    incrementUsage,
    refetch: fetchOptions
  };
};