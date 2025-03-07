
import React, { useEffect, useRef } from 'react';

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

  return (
    <div className={`video-container w-full overflow-hidden rounded-lg ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={controls}
        poster={poster}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {title && <span className="sr-only">{title}</span>}
    </div>
  );
};

export default VideoPlayer;
