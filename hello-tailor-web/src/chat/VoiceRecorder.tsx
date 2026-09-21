import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Mic, Pause, Play, Send, Square, X } from 'lucide-react';
import { formatDuration, pickRecorderMime, voiceSupported } from './voiceUtils';

const MAX_SEC = 120;
type Phase = 'idle' | 'requesting' | 'recording' | 'preview';
interface Clip { url: string; blob: Blob; durationSec: number; mimeType: string }

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

// Owns the whole recorder flow. While recording/previewing it renders its bar INSTEAD of `form`;
// otherwise it renders `form(micButton)` so the composer keeps its normal layout.
export default function VoiceRecorder({ disabled, showMic, onSend, form }: {
  disabled: boolean;
  showMic: boolean;
  onSend: (dataUrl: string, durationSec: number, mimeType: string) => Promise<void>;
  form: (mic: ReactNode, notice: ReactNode) => ReactNode;
}) {
  const supported = voiceSupported();
  const [phase, setPhase] = useState<Phase>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [clip, setClip] = useState<Clip | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const discardRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clipUrlRef = useRef<string | null>(null);

  const releaseMic = useCallback(() => {
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const dropClip = useCallback(() => {
    audioRef.current?.pause();
    if (clipUrlRef.current) { URL.revokeObjectURL(clipUrlRef.current); clipUrlRef.current = null; }
    setClip(null); setPlaying(false);
  }, []);

  // Unmount: stop mic, timers, recorder callbacks, object URL.
  useEffect(() => () => {
    discardRef.current = true;
    const rec = recorderRef.current;
    if (rec) { rec.ondataavailable = null; rec.onstop = null; rec.onerror = null; if (rec.state !== 'inactive') { try { rec.stop(); } catch { /* already stopped */ } } }
    releaseMic();
    audioRef.current?.pause();
    if (clipUrlRef.current) URL.revokeObjectURL(clipUrlRef.current);
  }, [releaseMic]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') rec.stop(); // onstop finalises
  }, []);

  async function start() {
    if (!supported || disabled || phase !== 'idle') return;
    setMessage(''); setPhase('requesting');
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (err) {
      const name = (err as DOMException).name;
      setMessage(name === 'NotAllowedError' || name === 'SecurityError' ? 'Microphone access was denied. Please allow microphone access in your browser settings and try again.'
        : name === 'NotFoundError' || name === 'OverconstrainedError' ? 'No microphone was found on this device.'
        : 'Could not start the microphone. Please try again.');
      setPhase('idle'); return;
    }
    streamRef.current = stream;
    try {
      const mime = pickRecorderMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      const actualMime = rec.mimeType || mime || 'audio/webm';
      chunksRef.current = []; discardRef.current = false; recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onerror = () => { discardRef.current = true; releaseMic(); setMessage('Recording failed. Please try again.'); setPhase('idle'); };
      rec.onstop = () => {
        const seconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        releaseMic();
        recorderRef.current = null;
        if (discardRef.current) return;
        const blob = new Blob(chunksRef.current, { type: actualMime });
        chunksRef.current = [];
        if (blob.size === 0) { setMessage('The recording was empty. Please try again.'); setPhase('idle'); return; }
        const url = URL.createObjectURL(blob);
        clipUrlRef.current = url;
        setClip({ url, blob, durationSec: Math.min(seconds, MAX_SEC), mimeType: actualMime });
        setPhase('preview');
      };
      startRef.current = Date.now(); setElapsed(0);
      rec.start();
      timerRef.current = window.setInterval(() => {
        const s = Math.floor((Date.now() - startRef.current) / 1000);
        setElapsed(Math.min(s, MAX_SEC));
        if (s >= MAX_SEC) stop();
      }, 250);
      setPhase('recording');
    } catch {
      releaseMic(); setMessage('Recording is not supported in this browser.'); setPhase('idle');
    }
  }

  function cancelRecording() {
    discardRef.current = true;
    stop(); releaseMic(); recorderRef.current = null; setPhase('idle');
  }

  function discard() { dropClip(); setPhase('idle'); }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setPlaying(false)); else audio.pause();
  }

  async function send() {
    if (!clip || clip.blob.size === 0 || busy) return;
    setBusy(true); setMessage('');
    try {
      await onSend(await blobToDataUrl(clip.blob), clip.durationSec, clip.mimeType);
      dropClip(); setPhase('idle');
    } catch { setMessage('Your voice message could not be sent. Please try again.'); }
    finally { setBusy(false); }
  }

  const mic = !showMic ? null : <button type="button" onClick={() => void start()} disabled={!supported || disabled || phase !== 'idle'}
    aria-label={supported ? 'Record voice message' : 'Voice messages are not supported in this browser'}
    title={supported ? 'Record voice message' : 'Voice messages need a modern browser over HTTPS'}
    className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-ocean text-white disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text"><Mic size={20} /></button>;
  const notice = !supported ? <p className="mb-2 px-2 text-xs text-ht-text-secondary">Voice messages aren’t available here (they need a modern browser over HTTPS).</p>
    : phase === 'requesting' ? <p role="status" className="mb-2 px-2 text-xs text-ht-text-secondary">Waiting for microphone permission…</p>
    : message ? <p role="alert" className="mb-2 px-2 text-sm text-ht-error">{message}</p> : null;

  if (phase === 'recording') return <div className="flex items-center gap-2" role="group" aria-label="Recording voice message">
    <button type="button" onClick={cancelRecording} aria-label="Cancel recording" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-bg text-ht-text-secondary"><X size={20} /></button>
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-ht-bg px-3 py-3 text-sm" role="status">
      <span aria-hidden className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-red-600" />
      <span className="truncate font-medium text-red-600">Recording</span>
      <span className="ml-auto tabular-nums" aria-label={`Elapsed ${formatDuration(elapsed)} of ${formatDuration(MAX_SEC)}`}>{formatDuration(elapsed)}</span>
    </div>
    <button type="button" onClick={stop} aria-label="Stop recording" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"><Square size={18} fill="currentColor" /></button>
  </div>;

  if (phase === 'preview' && clip) return <div>
    {notice}
    <div className="flex items-center gap-2" role="group" aria-label="Voice message preview">
      <audio ref={audioRef} src={clip.url} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} className="hidden" />
      <button type="button" onClick={discard} disabled={busy} aria-label="Discard recording" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-bg text-ht-text-secondary"><X size={20} /></button>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-ht-bg px-2 py-1">
        <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause preview' : 'Play preview'} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ht-ocean text-white">{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}</button>
        <span className="truncate text-sm tabular-nums">Voice message · {formatDuration(clip.durationSec)}</span>
      </div>
      <button type="button" onClick={() => void send()} disabled={busy || disabled} aria-label="Send voice message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-ocean text-white disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text"><Send size={20} /></button>
    </div>
  </div>;

  return <>{form(mic, notice)}</>;
}
