-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests if not already enabled  
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the featured artists rotation to run daily at midnight UTC
SELECT cron.schedule(
  'rotate-featured-artists-daily',
  '0 0 * * *', -- Every day at midnight UTC
  $$
  SELECT
    net.http_post(
        url:='https://iqmskopbhrzqqqjewdzv.supabase.co/functions/v1/rotate-featured-artists',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbXNrb3BiaHJ6cXFxamV3ZHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MDA3MTksImV4cCI6MjA1NDk3NjcxOX0.lIp4QNNn61csUT7kYxtT8BQkEkfCLCJIlXS-KGCgIhw"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);