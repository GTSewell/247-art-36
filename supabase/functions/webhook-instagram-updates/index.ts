import { corsHeaders } from '../_shared/cors.ts';

const VERIFY_TOKEN = 'instagram_webhook_verify_247art';

Deno.serve(async (req) => {
  const { method } = req;
  const url = new URL(req.url);

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (method === 'GET') {
      // Handle webhook verification challenge from Meta
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Webhook verification attempt:', { mode, token, challenge });

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully');
        return new Response(challenge, { 
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'text/plain'
          }
        });
      } else {
        console.log('Webhook verification failed:', { mode, token, expectedToken: VERIFY_TOKEN });
        return new Response('Forbidden', { 
          status: 403,
          headers: corsHeaders
        });
      }
    }

    if (method === 'POST') {
      // Handle Instagram webhook events
      const body = await req.json();
      console.log('Instagram webhook event received:', JSON.stringify(body, null, 2));

      // Process webhook events here
      // For now, just log the events
      if (body.object === 'instagram') {
        for (const entry of body.entry || []) {
          console.log('Processing Instagram entry:', entry);
          
          // Handle different event types
          if (entry.messaging) {
            console.log('Message events:', entry.messaging);
          }
          
          if (entry.changes) {
            console.log('Feed changes:', entry.changes);
          }
        }
      }

      return new Response('OK', { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});