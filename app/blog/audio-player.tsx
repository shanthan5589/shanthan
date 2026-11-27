"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const PLAYBACK_RATES = [
  { rate: 0.75, label: "0.75x" },
  { rate: 1, label: "Normal" },
  { rate: 1.25, label: "1.25x" },
  { rate: 1.5, label: "1.5x" },
  { rate: 2, label: "2x" },
] as const;

function formatTime(time: number) {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioPlayer({ src }: { src: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };

    syncDuration();
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [menuOpen]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;
      void audio.play();
      return;
    }

    audio.pause();
  };

  const handleSeek = (pctValue: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(pctValue)) return;

    if (audio.duration) {
      const nextTime = (pctValue / 100) * audio.duration;
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
    setPlaybackRate(rate);
    setMenuOpen(false);
  };

  const pct = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const rootClassName = [
    "ap",
    isPlaying ? "is-playing" : "",
    isMuted ? "is-muted" : "",
    menuOpen ? "menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClassName}>
      <audio
        ref={audioRef}
        preload="metadata"
        src={src}
        onLoadedMetadata={(event) => {
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onDurationChange={(event) => {
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
        onEnded={() => {
          if (audioRef.current) audioRef.current.currentTime = 0;
          setCurrentTime(0);
        }}
      />

      <button
        className="btn toggle"
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <svg className="icon-play" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg className="icon-pause" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      </button>

      <span className="time">
        <span className="now">{formatTime(currentTime)}</span> /{" "}
        <span className="dur">{formatTime(duration)}</span>
      </span>

      <input
        className="seek"
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={pct}
        onChange={(event) => handleSeek(event.currentTarget.valueAsNumber)}
        aria-label="Seek"
        style={{ "--pct": `${pct}%` } as CSSProperties}
      />

      <button
        className="btn mute"
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <svg className="icon-vol" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <svg className="icon-muted" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.26c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
        </svg>
      </button>

      <button
        className="btn more"
        type="button"
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={menuOpen}
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </button>

      <div className="menu" role="menu">
        <a className="download" href={src} download role="menuitem">
          Download
        </a>
        <div className="label">Playback speed</div>
        {PLAYBACK_RATES.map(({ rate, label }) => (
          <button
            key={rate}
            type="button"
            role="menuitemradio"
            aria-checked={playbackRate === rate}
            onClick={() => handleRateChange(rate)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
