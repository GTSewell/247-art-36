-- Create table for featured artists rotation system
CREATE TABLE public.featured_artists_rotation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_ids INTEGER[] NOT NULL,
  rotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  used_artist_ids INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_artists_rotation ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Featured artist rotation is viewable by everyone" 
ON public.featured_artists_rotation 
FOR SELECT 
USING (true);

-- Create policy for system updates (admins only)
CREATE POLICY "System can manage featured rotation" 
ON public.featured_artists_rotation 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_featured_rotation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_featured_rotation_updated_at
BEFORE UPDATE ON public.featured_artists_rotation
FOR EACH ROW
EXECUTE FUNCTION public.update_featured_rotation_updated_at();

-- Initialize with first rotation using artists with profile images
INSERT INTO public.featured_artists_rotation (artist_ids, used_artist_ids)
VALUES (
  ARRAY[24, 26, 31], -- GT Sewell, Lizz Robb, Crisis - all have profile images
  ARRAY[24, 26, 31]
);