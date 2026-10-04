'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface MusicPlayerProps {
  youtubeUrl: string;
  enabled: boolean;
  defaultVolume?: number;
  triggerPlay?: boolean;
}

// Helper to extract YouTube ID
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayer({
  youtubeUrl,
  enabled = true,
  defaultVolume = 40,
  triggerPlay = false,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Giai điệu vườn hoa');
  const playerRef = useRef<any>(null);
  const containerId = 'youtube-audio-player';

  const videoId = getYouTubeId(youtubeUrl);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || !videoId) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }
  }, [enabled, videoId]);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isApiReady || !videoId || !enabled) return;

    try {
      if (playerRef.current) {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(videoId);
          playerRef.current.setVolume(volume);
        }
        return;
      }

      playerRef.current = new window.YT.Player(containerId, {
        height: '10',
        width: '10',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            if (triggerPlay) {
              event.target.playVideo();
              setIsPlaying(true);
            }
            try {
              const data = event.target.getVideoData();
              if (data && data.title) {
                setCurrentTitle(data.title);
              }
            } catch (e) {}
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    } catch (err) {
      console.warn('YouTube Player init notice:', err);
    }
  }, [isApiReady, videoId, enabled]);

  // Handle trigger play from intro screen
  useEffect(() => {
    if (triggerPlay && playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (err) {}
    }
  }, [triggerPlay]);

  const togglePlay = () => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') {
      return;
    }
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(newVol);
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      playerRef.current?.unMute();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  if (!enabled || !videoId) return null;

  return (
    <>
      {/* Hidden YouTube IFrame container */}
      <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        <div id={containerId} />
      </div>

      {/* Floating Mini Music Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <div
          className={`pastel-glass-card rounded-2xl border border-pink-200/90 shadow-lg transition-all duration-300 ${
            isExpanded ? 'p-3 w-64' : 'p-2 w-auto'
          }`}
        >
          {isExpanded ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-pink-100 pb-1.5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`text-base ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '6s' }}
                  >
                    🌸
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#5a3e4c] truncate">
                      {currentTitle}
                    </p>
                    <p className="text-[10px] text-[#917684]">Nhạc nền vườn hoa</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-pink-100/60 rounded-full text-[#7d5f6e] transition-colors"
                  title="Thu gọn"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-[#543542] hover:scale-105 active:scale-95 transition-transform shadow-xs"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    onClick={toggleMute}
                    className="text-[#7d5f6e] hover:text-[#543542] transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                  <span className="text-[10px] font-mono text-[#8a727d] w-6 text-right">
                    {isMuted ? '0%' : `${volume}%`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 text-[#5a3a49] hover:scale-105 active:scale-95 shadow-xs transition-all duration-200 cursor-pointer"
                title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}
              >
                {isPlaying ? (
                  <span
                    className="text-base animate-spin"
                    style={{ animationDuration: '4s' }}
                  >
                    🌸
                  </span>
                ) : (
                  <Music className="w-4 h-4 text-rose-500" />
                )}
              </button>

              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1 text-xs font-medium text-[#6b4c5b] hover:text-[#4d2f3d] px-2 py-1 rounded-full hover:bg-pink-100/50 transition-colors"
              >
                <span>{isPlaying ? 'Đang phát' : 'Nhạc vườn'}</span>
                <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
