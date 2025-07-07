-- Drop the existing conflicting UPDATE policies and create a single comprehensive one
DROP POLICY IF EXISTS "Users can update their own artist profile" ON public.artists;
DROP POLICY IF EXISTS "Admins can update any artist profile" ON public.artists;

-- Create a single UPDATE policy that covers both cases
CREATE POLICY "Artists update policy" 
ON public.artists 
FOR UPDATE 
USING (
  -- Either the user owns the profile (has matching user_id)
  auth.uid() = user_id 
  OR 
  -- Or the user is an admin
  auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role = 'admin'
  )
);