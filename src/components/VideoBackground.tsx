import { useHlsVideo } from "../hooks/useHlsVideo";

interface VideoBackgroundProps {
  src: string;
}

export default function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useHlsVideo(src);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  );
}
