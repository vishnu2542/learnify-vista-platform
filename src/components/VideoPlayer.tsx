
import React, { useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, className, onComplete }) => {
  // Helper function to extract YouTube video ID from URL
  const getYoutubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url; // Return original URL if not a YouTube URL
  };

  // Helper function to check if URL is from Vimeo
  const isVimeoUrl = (url: string): boolean => {
    return /vimeo.com\/(?:.*\/)?(.+)/.test(url);
  };

  // Helper function to extract Vimeo video ID from URL
  const getVimeoEmbedUrl = (url: string): string => {
    const regExp = /vimeo.com\/(?:.*\/)?(.+)/;
    const match = url.match(regExp);
    
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
    
    return url; // Return original URL if not a Vimeo URL
  };

  // Determine the embed URL based on the video platform
  const getEmbedUrl = (url: string): string => {
    if (url.includes("youtube") || url.includes("youtu.be")) {
      return getYoutubeEmbedUrl(url);
    } else if (isVimeoUrl(url)) {
      return getVimeoEmbedUrl(url);
    } else {
      return url;
    }
  };

  // Simulate video completion after a timeout (for demo purposes)
  useEffect(() => {
    if (onComplete) {
      // In a real application, you'd listen for actual video completion events
      const timer = setTimeout(() => {
        onComplete();
      }, 15000); // 15 seconds for demo
      
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className={cn("rounded-md overflow-hidden", className)}>
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={embedUrl}
          title={title || "Video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;
