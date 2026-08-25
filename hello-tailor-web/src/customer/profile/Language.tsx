import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { clsx } from '@/components/ui/clsx';

const LANGUAGES: { code: 'English' | 'Tamil'; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
];

export default function LanguageScreen() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  return (
    <div>
      <ScreenHeader title="Language" subtitle={`Currently: ${language}`} />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {LANGUAGES.map((l) => {
          const active = language === l.code;
          return (
            <button key={l.code} onClick={() => setLanguage(l.code)} className={clsx('flex min-h-[60px] items-center gap-3 rounded-ht-card border-[1.5px] p-4 text-left', active ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-ht-card')}>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-ht-text">{l.label}</p>
                <p className="text-[12px] text-ht-text-secondary">{l.native}</p>
              </div>
              <span>{active ? '🔵' : '⚪'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
