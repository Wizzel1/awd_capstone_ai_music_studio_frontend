import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioPlaybackContextType {
  audioUrl: string | null;
  setAudioUrl: (audioUrl: string | null) => void;
  audioFileId: string | null;
  setAudioFileId: (audioFileId: string | null) => void;
  volume: number;
  setVolume: (volume: number) => void;
}
const AudioPlaybackContext = createContext<
  AudioPlaybackContextType | undefined
>(undefined);

export const useAudioPlayback = () => {
  const context = useContext(AudioPlaybackContext);
  if (!context) {
    throw new Error(
      "useAudioPlayback must be used within a AudioPlaybackProvider"
    );
  }
  return context;
};

export const AudioPlaybackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFileId, setAudioFileId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const handleAudioEnded = () => {
    setAudioUrl(null);
  };
  const handleAudioError = () => {
    setAudioUrl(null);
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef.current]);
  return (
    <AudioPlaybackContext.Provider
      value={{
        audioUrl,
        setAudioUrl,
        audioFileId,
        setAudioFileId,
        volume,
        setVolume,
      }}
    >
      {audioUrl && (
        <audio
          autoPlay
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          preload="metadata"
        />
      )}
      {children}
    </AudioPlaybackContext.Provider>
  );
};
