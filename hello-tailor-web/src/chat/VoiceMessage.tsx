import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { formatDuration, waveformBars } from './voiceUtils';

// Only one voice message plays at a time: the active bubble registers its pause callback here.
let pauseCurrent: (() => void) | null = null;

export default function VoiceMessage({ id, src, durationSec, mine }: { id: string; src: string; durationSec: number; mine: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [failed, setFailed] = useState(false);
  const bars = useMemo(() => waveformBars(id), [id]);
  const total = durationSec > 0 ? durationSec : 0;

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = 'metadata';
    audioRef.current = audio;
    const stop = () => audio.pause();
    stopRef.current = stop;
    const pause = () => setPlaying(false);
    const onTime = () => setCurrent(audio.currentTime);
    const onEnded = () => { setPlaying(false); setCurrent(0); audio.currentTime = 0; };
    const onError = () => { setPlaying(false); setFailed(true); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', pause);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', pause);
      audio.removeEventListener('error', onError);
      audio.removeAttribute('src');
      audioRef.current = null;
      if (pauseCurrent === stop) pauseCurrent = null;
    };
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    if (pauseCurrent && pauseCurrent !== stopRef.current) pauseCurrent();
    setFailed(false);
    pauseCurrent = stopRef.current;
    audio.play().then(() => setPlaying(true)).catch(() => { setPlaying(false); setFailed(true); });
  }

  function seek(event: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !total) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * total;
    setCurrent(audio.currentTime);
  }

  const progress = total ? Math.min(1, current / total) : 0;
  const playedBar = mine ? 'bg-white' : 'bg-ht-ocean';
  const idleBar = mine ? 'bg-white/40' : 'bg-ht-border';

  return <div className="w-56 max-w-full sm:w-64">
    <div className="flex items-center gap-2">
      <button type="button" onClick={toggle} aria-label={playing ? 'Pause voice message' : 'Play voice message'}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${mine ? 'bg-white text-ht-ocean' : 'bg-ht-ocean text-white'}`}>
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>
      <div onClick={seek} role="presentation" className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-px">
        {bars.map((h, i) => <span key={i} style={{ height: `${h}%` }} className={`min-w-0 flex-1 rounded-full ${(i + 0.5) / bars.length <= progress ? playedBar : idleBar}`} />)}
      </div>
    </div>
    <p className="mt-1 pl-12 text-xs tabular-nums">{failed ? 'Audio unavailable' : `${formatDuration(current)} / ${formatDuration(total)}`}</p>
  </div>;
}
