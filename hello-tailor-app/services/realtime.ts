// Phase 25 — real-time frontend architecture.
// A tiny in-memory pub/sub standing in for a WebSocket/Socket.IO client. It emits the exact
// event contract (RealtimeEvent, defined in store/chatTypes.ts) a real socket client would —
// message:new, message:sent, message:delivered, message:read, typing:start/stop,
// design:approval, design:changes_requested — so chatStore's subscribeToConversation /
// unsubscribeFromConversation and every UI consumer are already written against the real
// shape. Swapping this file's internals for an actual `socket.io-client` connection later
// does not require touching chatStore.ts or any screen.
import type { RealtimeEvent } from '@/store/chatTypes';

type Listener = (event: RealtimeEvent) => void;

const listeners = new Set<Listener>();

export function emitRealtimeEvent(event: RealtimeEvent) {
  listeners.forEach((fn) => fn(event));
}

// subscribeToConversation / unsubscribeFromConversation (Phase 26) are the public API screens
// and the store use — they don't know or care this is a local emitter today.
export function subscribeToRealtime(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function realtimeListenerCount() {
  return listeners.size;
}
