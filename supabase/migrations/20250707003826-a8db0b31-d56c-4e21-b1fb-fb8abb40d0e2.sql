-- Add RLS policy to allow admin users to update any artist profile
CREATE POLICY "Admins can update any artist profile" 
ON public.artists 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role = 'admin'
  )
);