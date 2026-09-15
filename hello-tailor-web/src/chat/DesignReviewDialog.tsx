import { useState } from 'react';
import Button from '@/components/ui/Button';
import { approveDesign, requestDesignChanges } from '@/services/chatService';
import { CHANGE_REQUEST_OPTIONS, type ChangeRequestOption, type DesignVersion } from '@/store/chatTypes';
import ChatDialog from './ChatDialog';
import { readImageFile } from './helpers';

export default function DesignReviewDialog({ version, mode, onClose }: { version: DesignVersion; mode: 'approve' | 'changes'; onClose: () => void }) {
  const [categories, setCategories] = useState<ChangeRequestOption[]>([]);
  const [instructions, setInstructions] = useState('');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');
  return <ChatDialog title={`${mode === 'approve' ? 'Approve' : 'Request changes to'} Design V${version.version}`} onClose={() => { if (!busy) onClose(); }}>
    <form className="space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      if (busy || reading || (mode === 'changes' && (!categories.length || !instructions.trim()))) return;
      setBusy(true); setError('');
      try {
        if (mode === 'approve') await approveDesign(version.id);
        else await requestDesignChanges(version.id, categories, instructions.trim(), reference || undefined);
        onClose();
      } catch { setError('Unable to save your response. Please try again.'); }
      finally { setBusy(false); }
    }}>
      {mode === 'approve' ? <p className="text-sm leading-relaxed text-ht-text-secondary">Confirm that the design looks right. Your tailor will see your approval for this version.</p> : <>
        <fieldset><legend className="mb-2 text-sm font-medium">What needs changing?</legend><div className="grid grid-cols-2 gap-2">{CHANGE_REQUEST_OPTIONS.map((option) => <label key={option} className="flex items-center gap-2 rounded-ht-input border border-ht-border p-3 text-sm">
          <input type="checkbox" checked={categories.includes(option)} onChange={(e) => setCategories((values) => e.target.checked ? [...values, option] : values.filter((v) => v !== option))} />{option}
        </label>)}</div></fieldset>
        <label className="block text-sm font-medium">Instructions<textarea required maxLength={2000} value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} placeholder="Explain what you would like changed…"
          className="mt-1 block w-full rounded-ht-input border border-ht-border p-3 font-normal" /></label>
        <label className="block text-sm font-medium">Reference photo (optional)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-xs" onChange={async (e) => {
          const file = e.target.files?.[0]; if (!file) return;
          setReading(true); setError('');
          try { setReference(await readImageFile(file)); }
          catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to open image.'); }
          finally { setReading(false); }
        }} /></label>
        {reference && <div><img src={reference} alt="Change request reference" className="max-h-40 rounded-ht-input" /><button type="button" className="mt-1 text-sm text-ht-error" onClick={() => setReference('')}>Remove reference</button></div>}
      </>}
      {error && <p role="alert" className="text-sm text-ht-error">{error}</p>}
      <div className="flex gap-2"><Button type="button" variant="secondary" label="Cancel" disabled={busy} onClick={onClose} />
        <Button type="submit" label={busy ? 'Saving…' : mode === 'approve' ? 'Confirm approval' : 'Send change request'} disabled={busy || reading || (mode === 'changes' && (!categories.length || !instructions.trim()))} />
      </div>
    </form>
  </ChatDialog>;
}
