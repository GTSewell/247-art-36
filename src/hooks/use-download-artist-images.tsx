
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface DownloadResult {
  success: Array<{
    id: number;
    name: string;
    newUrl: string;
  }>;
  failed: Array<{
    id: number;
    reason: string;
  }>;
  skipped: Array<{
    id: number;
    reason: string;
  }>;
}

// Disable this hook completely
export const useDownloadArtistImages = () => {
  // Return dummy values that don't do anything
  return {
    downloadImages: () => {},
    isDownloading: false,
    result: null,
    errorDetails: null,
  };
};
