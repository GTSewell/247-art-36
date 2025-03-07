
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Uploads a video file to Supabase storage
 * @param file - The video file to upload
 * @param bucketName - The storage bucket name (default: 'videos')
 * @param path - Optional path within the bucket
 * @returns The URL of the uploaded video or null if upload failed
 */
export const uploadVideo = async (
  file: File, 
  bucketName: string = 'videos',
  path?: string
): Promise<string | null> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    toast({
      title: "Upload Failed",
      description: "An unexpected error occurred during upload",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get a list of all videos in a bucket
 * @param bucketName - The storage bucket name (default: 'videos')
 * @param path - Optional path within the bucket
 * @returns Array of video objects or empty array if failed
 */
export const listVideos = async (
  bucketName: string = 'videos',
  path?: string
): Promise<{name: string, url: string}[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path || '', {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('Error listing videos:', error);
      return [];
    }
    
    // Filter for video files and convert to URLs
    return data
      .filter(item => !item.id.endsWith('/') && isVideoFile(item.name))
      .map(item => ({
        name: item.name,
        url: supabase.storage
          .from(bucketName)
          .getPublicUrl(path ? `${path}/${item.name}` : item.name).data.publicUrl
      }));
  } catch (error) {
    console.error('Unexpected error listing videos:', error);
    return [];
  }
};

// Helper to check if filename is a video
const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return videoExtensions.includes(ext);
};
