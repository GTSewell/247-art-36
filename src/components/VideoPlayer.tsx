
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { logger } from "@/utils/logger";

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

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleError = () => {
        const errorMessage = "Unable to load video. Please try again later.";
        logger.error("Video error:", { src, error: video.error });
        setError(errorMessage);
        setIsLoading(false);
        toast({
          title: "Video Error",
          description: errorMessage,
          variant: "destructive"
        });
      };
      
      const handleLoaded = () => {
        setIsLoading(false);
        logger.info("Video loaded successfully", { src });
      };

      video.addEventListener('error', handleError);
      video.addEventListener('loadeddata', handleLoaded);
      
      // Set a timeout to check if video is still loading after 10 seconds
      const timeout = setTimeout(() => {
        if (isLoading) {
          logger.warn("Video load timeout", { src });
          setIsLoading(false);
        }
      }, 10000);

      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadeddata', handleLoaded);
        clearTimeout(timeout);
      };
    }
  }, [src, isLoading]);

  return (
    <div className={`video-container w-full overflow-hidden rounded-lg ${className}`}>
      {isLoading && (
        <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center text-gray-500">
          Loading video...
        </div>
      )}
      
      {error ? (
        <div className="w-full h-64 bg-red-100 flex items-center justify-center text-red-500 p-4 text-center">
          <p>{error}</p>
          <p className="text-sm mt-2">Please check the console for more details</p>
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
