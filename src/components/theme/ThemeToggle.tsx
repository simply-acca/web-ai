'use client';
import { useTheme } from './useTheme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative inline-flex items-center gap-1 rounded-xl border border-white/15 p-1 text-xs">
      {(['light','system','dark'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={[
            'rounded-lg px-2 py-1 capitalize transition',
            theme === t ? 'bg-emerald-500 text-gray-900' : 'text-gray-300 hover:text-white'
          ].join(' ')}
          aria-pressed={theme === t}
        >
          {t}
        </button>
      ))}
    </div>
  );
}