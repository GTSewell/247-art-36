-- Create a security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Drop existing policy and create a new one with better admin handling
DROP POLICY IF EXISTS "Artists update policy" ON artists;

CREATE POLICY "Artists update policy" 
ON public.artists 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR public.is_admin()
);

-- Also ensure the FOR ALL policy works for admin access
DROP POLICY IF EXISTS "Users can update their own artist profile" ON artist_profiles;

CREATE POLICY "Users can update their own artist profile" 
ON public.artist_profiles 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM artists 
    WHERE artists.id = artist_profiles.artist_id 
    AND (artists.user_id = auth.uid() OR public.is_admin())
  )
);