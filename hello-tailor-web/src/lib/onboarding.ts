// Section 7 — onboarding should show only on first launch. localStorage survives full page
// reloads (unlike the zustand auth store, which is intentionally in-memory-only for this
// prototype), so it's the right place for a "has this browser seen onboarding" flag.
const KEY = 'ht_onboarding_complete';

export function isOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    // Private-browsing / storage-blocked contexts: fail open (show onboarding every time)
    // rather than throwing and breaking the splash screen's redirect decision.
    return false;
  }
}

export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Nothing useful to do if storage is unavailable — onboarding will just show again next
    // launch, which is a safe degradation, not a crash.
  }
}
