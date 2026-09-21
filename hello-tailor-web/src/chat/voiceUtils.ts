export const formatDuration = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Deterministic pseudo-waveform (heights 25-100 %) seeded from the message id.
export function waveformBars(seed: string, count = 32): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return Array.from({ length: count }, () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    return 25 + (h % 76);
  });
}

const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

export function pickRecorderMime(): string {
  return MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
}

export function voiceSupported(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext && typeof MediaRecorder !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
}
