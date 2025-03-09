
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Artist } from '@/data/types/artist';
import { useArtists } from '@/hooks/use-artists';

const DownloadArtistImages = ({ artistId, isPwa = false }: { artistId?: number; isPwa?: boolean }) => {
  // This component is now disabled for all views
  return null;
};

export default DownloadArtistImages;
