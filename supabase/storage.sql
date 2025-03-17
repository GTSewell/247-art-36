
-- This SQL will be executed via the SQL editor to create the storage bucket for artist images
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-images', 'Artist Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow anonymous access to download images from the public bucket
CREATE POLICY "Public Access for artist-images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'artist-images');

-- Create a policy to allow authenticated users to upload to this bucket (for admins)
CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'artist-images' AND auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'artist-images' AND auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'artist-images' AND auth.role() = 'authenticated');
