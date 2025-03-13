
// Follow Deno conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define demo account details
    const email = 'demo@247.art';
    const password = '123456';
    const userMetadata = { name: 'Demo User' };

    console.log('Checking if demo account exists...');

    // First, try to get the user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers({
      search: email
    });

    if (getUserError) {
      throw getUserError;
    }

    // Check if user exists
    const userExists = users && users.users && users.users.some(user => user.email === email);

    if (userExists) {
      console.log('Demo account exists, updating password...');
      
      // Find the user ID
      const userId = users.users.find(user => user.email === email)?.id;
      
      if (!userId) {
        throw new Error('Could not find user ID for demo account');
      }
      
      // Update the user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      // Also confirm the user's email if not already confirmed
      await supabase.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      );
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Demo account password updated and email confirmed', 
          action: 'updated' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } else {
      console.log('Demo account does not exist, creating...');
      
      // Create a new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userMetadata
      });
      
      if (createError) {
        throw createError;
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Demo account created with email already confirmed', 
          action: 'created',
          user: newUser
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'An error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
