-- Create table for storing user-added specification options
CREATE TABLE IF NOT EXISTS public.specification_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  option_value TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, option_value)
);

-- Enable RLS
ALTER TABLE public.specification_options ENABLE ROW LEVEL SECURITY;

-- Create policies for specification options
CREATE POLICY "Everyone can view specification options"
  ON public.specification_options FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add specification options"
  ON public.specification_options FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own specification options"
  ON public.specification_options FOR UPDATE
  USING (auth.uid() = created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_specification_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_specification_options_updated_at
  BEFORE UPDATE ON public.specification_options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_specification_options_updated_at();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_specification_options_category 
  ON public.specification_options(category);
CREATE INDEX IF NOT EXISTS idx_specification_options_usage_count 
  ON public.specification_options(usage_count DESC);