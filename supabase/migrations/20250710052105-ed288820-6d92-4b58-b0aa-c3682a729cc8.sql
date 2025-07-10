-- Create table to store Instagram OAuth connections
CREATE TABLE public.instagram_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  instagram_user_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  username TEXT NOT NULL,
  profile_picture_url TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instagram_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view their own Instagram connections" 
ON public.instagram_connections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Instagram connections" 
ON public.instagram_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Instagram connections" 
ON public.instagram_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Instagram connections" 
ON public.instagram_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_instagram_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_instagram_connections_updated_at
  BEFORE UPDATE ON public.instagram_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_instagram_connections_updated_at();