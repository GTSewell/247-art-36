
-- This SQL will be executed via the SQL editor to create the storage buckets for artist images

-- Create the artist-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-images', 'Artist Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create the artists bucket (newer version)
INSERT INTO storage.buckets (id, name, public)
VALUES ('artists', 'Artists', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow anonymous access to download images from both public buckets
CREATE POLICY "Public Access for artist-images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'artist-images')
ON CONFLICT DO NOTHING;

CREATE POLICY "Public Access for artists" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'artists')
ON CONFLICT DO NOTHING;

-- Create a policy to allow authenticated users to upload to these buckets (for admins)
CREATE POLICY "Authenticated users can upload artist-images" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'artist-images' AND auth.role() = 'authenticated')
ON CONFLICT DO NOTHING;

CREATE POLICY "Authenticated users can upload artists" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'artists' AND auth.role() = 'authenticated')
ON CONFLICT DO NOTHING;

-- Create a policy to allow authenticated users to update their own images
CREATE POLICY "Users can update artist-images" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'artist-images' AND auth.role() = 'authenticated')
ON CONFLICT DO NOTHING;

CREATE POLICY "Users can update artists" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'artists' AND auth.role() = 'authenticated')
ON CONFLICT DO NOTHING;

-- Create a policy to allow authenticated users to delete their own images
CREATE POLICY "Users can delete artist-images" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'artist-images' AND auth.role() = 'authenticated')
ON CONFLICT DO NOTHING;

CREATE POLICY "Users can delete artists" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'artists' AND auth.role() = 'authenticated')
ON CONFLICT DO NOTHING;
