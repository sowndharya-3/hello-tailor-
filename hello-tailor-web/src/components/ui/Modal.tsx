import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Renders as a bottom sheet on narrow viewports, a centered modal on wide ones —
// matches the native app's BottomSheet component's role, done with pure CSS (no JS
// breakpoint check needed since Tailwind's sm: handles it).
export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-ht-sheet sm:rounded-ht-card bg-white p-5 shadow-xl animate-in slide-in-from-bottom">
        {title ? (
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-ht-text">{title}</h3>
            <button onClick={onClose} className="text-ht-text-secondary text-xl leading-none px-2">
              ×
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
