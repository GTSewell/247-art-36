-- Add highlight_bio column to artists table for short bio snippets
ALTER TABLE public.artists 
ADD COLUMN highlight_bio text;