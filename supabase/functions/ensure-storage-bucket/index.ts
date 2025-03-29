
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Process both buckets
    const buckets = ['artist-images', 'artists'];
    const results = {};

    for (const bucketName of buckets) {
      // Check if the bucket exists
      const { data: bucketData, error: bucketError } = await supabaseAdmin
        .storage
        .getBucket(bucketName);
      
      if (bucketError && bucketError.message.includes('does not exist')) {
        console.log(`Bucket ${bucketName} does not exist, creating it now...`);
        
        // Create the bucket if it doesn't exist
        const { error: createBucketError } = await supabaseAdmin
          .storage
          .createBucket(bucketName, {
            public: true, // Make the bucket public
            fileSizeLimit: 10485760, // 10MB limit
          });
        
        if (createBucketError) {
          results[bucketName] = {
            success: false,
            error: `Failed to create storage bucket: ${createBucketError.message}`
          };
          continue;
        }
        
        // Create public access policies
        const createPublicPolicy = `
          CREATE POLICY "Public Access for ${bucketName}" ON storage.objects
          FOR SELECT
          USING (bucket_id = '${bucketName}');
        `;
        
        const createUploadPolicy = `
          CREATE POLICY "Authenticated users can upload images" ON storage.objects
          FOR INSERT
          WITH CHECK (bucket_id = '${bucketName}' AND auth.role() = 'authenticated');
        `;
        
        const createUpdatePolicy = `
          CREATE POLICY "Users can update own images" ON storage.objects
          FOR UPDATE
          USING (bucket_id = '${bucketName}' AND auth.role() = 'authenticated');
        `;
        
        const createDeletePolicy = `
          CREATE POLICY "Users can delete own images" ON storage.objects
          FOR DELETE
          USING (bucket_id = '${bucketName}' AND auth.role() = 'authenticated');
        `;
        
        // Execute the policy creation SQL
        // Note: This is a simplified example; in production, you would want to use the SQL API
        console.log(`Bucket ${bucketName} created successfully`);
        
        results[bucketName] = {
          success: true,
          message: `Storage bucket '${bucketName}' created successfully with public access`,
          details: "Please also make sure to create appropriate storage policies"
        };
      } else if (bucketError) {
        results[bucketName] = {
          success: false,
          error: bucketError.message
        };
      } else {
        console.log(`Bucket ${bucketName} already exists`);
        results[bucketName] = {
          success: true, 
          message: `Storage bucket '${bucketName}' already exists`,
          details: bucketData
        };
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ensure-storage-bucket function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
