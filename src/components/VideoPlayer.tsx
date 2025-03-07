import React, { useEffect, useRef, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { logger } from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
  poster?: string;
  controls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = "Video content",
  className = "",
  poster,
  controls = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleError = () => {
        logger.error("Video error:", { src, error: video.error, retryCount });
        
        if (retryCount < maxRetries) {
          setRetryCount(prevCount => prevCount + 1);
          setIsLoading(true);
          
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.load();
            }
          }, 1000);
          
          toast({
            title: "Retrying video load",
            description: `Attempt ${retryCount + 1} of ${maxRetries}`,
            variant: "default"
          });
        } else {
          const errorMessage = "Unable to load video. Please try again later.";
          setError(errorMessage);
          setIsLoading(false);
          toast({
            title: "Video Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
      };
      
      const handleLoaded = () => {
        setIsLoading(false);
        setError(null);
        logger.info("Video loaded successfully", { src });
      };

      video.addEventListener('error', handleError);
      video.addEventListener('loadeddata', handleLoaded);
      
      const timeout = setTimeout(() => {
        if (isLoading) {
          logger.warn("Video load timeout", { src });
          
          checkVideoExists(src)
            .then(exists => {
              if (!exists) {
                setError("The video file could not be found. Please check if it was uploaded correctly.");
                toast({
                  title: "Video Not Found",
                  description: "The video file could not be found in storage.",
                  variant: "destructive"
                });
              }
              setIsLoading(false);
            });
        }
      }, 15000);

      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadeddata', handleLoaded);
        clearTimeout(timeout);
      };
    }
  }, [src, isLoading, retryCount]);

  const checkVideoExists = async (url: string): Promise<boolean> => {
    try {
      if (!url.includes('supabase.co/storage')) {
        return true;
      }
      
      const bucketMatch = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
      if (!bucketMatch) return false;
      
      const bucket = bucketMatch[1];
      const path = bucketMatch[2];
      
      logger.info("Checking if video exists", { bucket, path });
      
      const { data } = await supabase
        .storage
        .from(bucket)
        .getPublicUrl(path);
      
      return !!data.publicUrl;
    } catch (err) {
      logger.error("Exception checking video existence", { err });
      return false;
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setRetryCount(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className={`video-container w-full overflow-hidden rounded-lg ${className}`}>
      {isLoading && (
        <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="mb-2">Loading video...</div>
            {retryCount > 0 && (
              <div className="text-xs">Retry attempt {retryCount} of {maxRetries}</div>
            )}
          </div>
        </div>
      )}
      
      {error ? (
        <div className="w-full h-64 bg-red-100 flex flex-col items-center justify-center text-red-500 p-4 text-center">
          <p>{error}</p>
          <p className="text-sm mt-2">The video may be too large or unavailable</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isLoading ? 'hidden' : 'block'}`}
          controls={controls}
          poster={poster}
          preload="metadata"
          playsInline
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {title && <span className="sr-only">{title}</span>}
    </div>
  );
};

export default VideoPlayer;
