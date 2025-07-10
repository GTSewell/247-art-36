-- Create the artists bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('artists', 'Artists', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to download images from the artists bucket
CREATE POLICY "Public Access for artists" ON storage.objects
FOR SELECT
USING (bucket_id = 'artists');

-- Create policy to allow authenticated users to upload to the artists bucket
CREATE POLICY "Authenticated users can upload artists" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'artists' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their own images in artists bucket
CREATE POLICY "Users can update artists" ON storage.objects
FOR UPDATE
USING (bucket_id = 'artists' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete their own images from artists bucket
CREATE POLICY "Users can delete artists" ON storage.objects
FOR DELETE
USING (bucket_id = 'artists' AND auth.role() = 'authenticated');