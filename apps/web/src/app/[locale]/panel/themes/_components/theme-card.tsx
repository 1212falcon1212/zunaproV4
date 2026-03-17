'use client';

interface ThemeManifest {
  id: string;
  name: string;
  description: string;
  sector: string;
  category?: 'sector' | 'universal';
  colorPalette?: string[];
  config: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground?: string;
    muted?: string;
    border?: string;
    fonts?: { heading: string; body: string };
    borderRadius?: string;
    layout?: {
      headerStyle?: string;
      productGridColumns?: number;
      footerColumns?: number;
    };
  };
}

interface ThemeCardProps {
  theme: ThemeManifest;
  isActive: boolean;
  onPreview: (theme: ThemeManifest) => void;
}

// Per-theme unique layout configurations for the mockup
const MOCKUP_CONFIGS: Record<string, {
  heroHeight: string;
  heroStyle: 'centered' | 'left-aligned' | 'text-only' | 'split';
  heroBg: 'dark' | 'primary' | 'light' | 'gradient';
  productCols: number;
  productCardHeight: string;
  showCategories: boolean;
  categoryStyle: 'grid' | 'circles' | 'list' | 'large';
  showBanner: boolean;
  headerStyle: 'standard' | 'centered' | 'minimal';
  radius: string;
}> = {
  genel: { heroHeight: 'h-20', heroStyle: 'centered', heroBg: 'dark', productCols: 4, productCardHeight: 'h-8', showCategories: true, categoryStyle: 'grid', showBanner: true, headerStyle: 'standard', radius: '4px' },
  mobilya: { heroHeight: 'h-24', heroStyle: 'left-aligned', heroBg: 'dark', productCols: 3, productCardHeight: 'h-10', showCategories: true, categoryStyle: 'large', showBanner: true, headerStyle: 'centered', radius: '8px' },
  teknoloji: { heroHeight: 'h-20', heroStyle: 'centered', heroBg: 'dark', productCols: 4, productCardHeight: 'h-8', showCategories: true, categoryStyle: 'grid', showBanner: true, headerStyle: 'standard', radius: '2px' },
  giyim: { heroHeight: 'h-28', heroStyle: 'split', heroBg: 'dark', productCols: 3, productCardHeight: 'h-12', showCategories: true, categoryStyle: 'grid', showBanner: true, headerStyle: 'centered', radius: '6px' },
  kozmetik: { heroHeight: 'h-22', heroStyle: 'centered', heroBg: 'primary', productCols: 4, productCardHeight: 'h-8', showCategories: true, categoryStyle: 'circles', showBanner: true, headerStyle: 'centered', radius: '12px' },
  gida: { heroHeight: 'h-20', heroStyle: 'left-aligned', heroBg: 'dark', productCols: 4, productCardHeight: 'h-8', showCategories: true, categoryStyle: 'grid', showBanner: true, headerStyle: 'standard', radius: '8px' },
  minimal: { heroHeight: 'h-16', heroStyle: 'text-only', heroBg: 'light', productCols: 3, productCardHeight: 'h-10', showCategories: true, categoryStyle: 'list', showBanner: false, headerStyle: 'minimal', radius: '2px' },
  bold: { heroHeight: 'h-28', heroStyle: 'centered', heroBg: 'primary', productCols: 3, productCardHeight: 'h-10', showCategories: true, categoryStyle: 'grid', showBanner: true, headerStyle: 'standard', radius: '12px' },
  elegant: { heroHeight: 'h-28', heroStyle: 'centered', heroBg: 'dark', productCols: 2, productCardHeight: 'h-14', showCategories: true, categoryStyle: 'grid', showBanner: true, headerStyle: 'centered', radius: '0px' },
};

function getHeroBg(theme: ThemeManifest, style: string): string {
  const c = theme.config;
  switch (style) {
    case 'dark': return c.foreground ?? '#0f172a';
    case 'primary': return c.primary;
    case 'light': return c.background;
    case 'gradient': return `linear-gradient(135deg, ${c.primary}, ${c.accent})`;
    default: return c.foreground ?? '#0f172a';
  }
}

function getHeroTextColor(style: string, theme: ThemeManifest): string {
  if (style === 'light') return theme.config.foreground ?? '#0f172a';
  return theme.config.background;
}

export function ThemeCard({ theme, isActive, onPreview }: ThemeCardProps) {
  const c = theme.config;
  const fonts = c.fonts ?? { heading: 'Inter', body: 'Inter' };
  const palette = theme.colorPalette ?? [c.primary, c.secondary, c.accent, c.background, c.foreground ?? '#0f172a'];
  const m = MOCKUP_CONFIGS[theme.id] ?? MOCKUP_CONFIGS.genel;
  const fg = c.foreground ?? '#0f172a';
  const muted = c.muted ?? c.secondary + '20';
  const border = c.border ?? fg + '15';

  return (
    <button
      type="button"
      onClick={() => onPreview(theme)}
      className={`group relative w-full overflow-hidden rounded-2xl border-2 bg-white text-left shadow-sm transition-all duration-300 hover:shadow-lg ${
        isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {isActive && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Active
        </div>
      )}

      <div className="absolute left-3 top-3 z-10">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-sm ${
          theme.category === 'universal' ? 'bg-violet-500/80 text-white' : 'bg-gray-900/70 text-white'
        }`}>
          {theme.category === 'universal' ? 'Universal' : theme.sector}
        </span>
      </div>

      {/* ===== UNIQUE MOCKUP ===== */}
      <div className="relative h-64 overflow-hidden" style={{ backgroundColor: c.background }}>

        {/* --- Header --- */}
        {m.headerStyle === 'minimal' ? (
          <div className="flex h-6 items-center justify-between px-4" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: fg, opacity: 0.7 }} />
            <div className="flex gap-3">
              {[1, 2, 3].map((n) => <div key={n} className="h-1 w-6 rounded-full" style={{ backgroundColor: fg, opacity: 0.3 }} />)}
            </div>
          </div>
        ) : m.headerStyle === 'centered' ? (
          <div className="flex h-8 flex-col items-center justify-center gap-0.5 px-4" style={{ backgroundColor: c.background, borderBottom: `1px solid ${border}` }}>
            <div className="h-2 w-14 rounded-sm" style={{ backgroundColor: c.primary, opacity: 0.9 }} />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => <div key={n} className="h-1 w-5 rounded-full" style={{ backgroundColor: fg, opacity: 0.35 }} />)}
            </div>
          </div>
        ) : (
          <div className="flex h-7 items-center justify-between px-4" style={{ backgroundColor: c.primary }}>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: c.background, opacity: 0.9 }} />
              <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: c.background, opacity: 0.6 }} />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => <div key={n} className="h-1 w-6 rounded-full" style={{ backgroundColor: c.background, opacity: 0.4 }} />)}
            </div>
          </div>
        )}

        {/* --- Hero --- */}
        {m.heroStyle === 'text-only' ? (
          <div className="flex flex-col items-center px-6 py-5" style={{ backgroundColor: c.background }}>
            <div className="mb-1 h-2.5 w-24 rounded-full" style={{ backgroundColor: fg, opacity: 0.8 }} />
            <div className="h-1.5 w-32 rounded-full" style={{ backgroundColor: fg, opacity: 0.25 }} />
          </div>
        ) : m.heroStyle === 'split' ? (
          <div className="flex h-24 items-stretch" style={{ background: getHeroBg(theme, m.heroBg) }}>
            <div className="flex flex-1 flex-col justify-center px-4">
              <div className="mb-1 h-2.5 w-20 rounded-full" style={{ backgroundColor: getHeroTextColor(m.heroBg, theme), opacity: 0.9 }} />
              <div className="mb-2 h-1.5 w-28 rounded-full" style={{ backgroundColor: getHeroTextColor(m.heroBg, theme), opacity: 0.4 }} />
              <div className="h-4 w-14 rounded" style={{ backgroundColor: c.accent, borderRadius: m.radius }} />
            </div>
            <div className="flex w-2/5 items-center justify-center" style={{ backgroundColor: c.secondary + '30' }}>
              <div className="h-14 w-12 rounded" style={{ backgroundColor: c.accent + '40', borderRadius: m.radius }} />
            </div>
          </div>
        ) : m.heroStyle === 'left-aligned' ? (
          <div className="flex h-20 flex-col justify-center px-5" style={{ background: getHeroBg(theme, m.heroBg) }}>
            <div className="mb-1 h-2.5 w-28 rounded-full" style={{ backgroundColor: getHeroTextColor(m.heroBg, theme), opacity: 0.9 }} />
            <div className="mb-2 h-1.5 w-36 rounded-full" style={{ backgroundColor: getHeroTextColor(m.heroBg, theme), opacity: 0.35 }} />
            <div className="h-4 w-16 rounded" style={{ backgroundColor: c.accent, borderRadius: m.radius }} />
          </div>
        ) : (
          <div className="flex h-20 flex-col items-center justify-center px-6" style={{ background: getHeroBg(theme, m.heroBg) }}>
            <div className="mb-1 h-2.5 w-28 rounded-full" style={{ backgroundColor: getHeroTextColor(m.heroBg, theme), opacity: 0.9 }} />
            <div className="mb-2 h-1.5 w-36 rounded-full" style={{ backgroundColor: getHeroTextColor(m.heroBg, theme), opacity: 0.35 }} />
            <div className="h-4 w-16 rounded" style={{ backgroundColor: c.accent, borderRadius: m.radius }} />
          </div>
        )}

        {/* --- Categories (if before products) --- */}
        {m.categoryStyle === 'circles' && (
          <div className="flex justify-center gap-2 px-4 py-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col items-center gap-0.5">
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: c.primary + '20', border: `1px solid ${c.primary}30` }} />
                <div className="h-1 w-5 rounded-full" style={{ backgroundColor: fg, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        )}

        {/* --- Product Grid --- */}
        <div className="px-4 py-2">
          <div className="mb-1.5 h-1.5 w-16 rounded-full" style={{ backgroundColor: fg, opacity: 0.5 }} />
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${m.productCols}, 1fr)` }}>
            {Array.from({ length: m.productCols }).map((_, n) => (
              <div key={n} className="overflow-hidden" style={{ borderRadius: m.radius, border: `1px solid ${border}`, backgroundColor: c.background }}>
                <div style={{ height: m.productCols === 2 ? '24px' : m.productCols === 3 ? '16px' : '12px', backgroundColor: c.secondary + '20' }} />
                <div className="space-y-0.5 p-1">
                  <div className="h-1 w-full rounded-full" style={{ backgroundColor: fg, opacity: 0.5 }} />
                  <div className="h-1 w-3/5 rounded-full" style={{ backgroundColor: c.primary, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Banner --- */}
        {m.showBanner && (
          <div className="mx-4 my-1 flex items-center justify-center py-1.5" style={{ backgroundColor: c.primary, borderRadius: m.radius }}>
            <div className="h-1 w-24 rounded-full" style={{ backgroundColor: c.background, opacity: 0.7 }} />
          </div>
        )}

        {/* --- Category section (grid/large/list) --- */}
        {m.categoryStyle === 'large' && (
          <div className="grid grid-cols-2 gap-1 px-4 py-1">
            {[1, 2].map((n) => (
              <div key={n} className="h-8" style={{ backgroundColor: c.secondary + '15', borderRadius: m.radius, border: `1px solid ${border}` }}>
                <div className="flex h-full items-center justify-center">
                  <div className="h-1 w-8 rounded-full" style={{ backgroundColor: fg, opacity: 0.4 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {m.categoryStyle === 'list' && (
          <div className="space-y-1 px-6 py-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between border-b py-0.5" style={{ borderColor: border }}>
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: fg, opacity: 0.4 }} />
                <div className="h-1 w-3 rounded-full" style={{ backgroundColor: fg, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Card Body ===== */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{theme.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">{theme.description}</p>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Colors</p>
          <div className="flex items-center gap-2">
            {palette.map((color, i) => (
              <div key={i} className="h-7 w-7 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Fonts</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{fonts.heading}</span>
            {fonts.heading !== fonts.body && (
              <>
                <span className="mx-1.5 text-gray-300">/</span>
                <span>{fonts.body}</span>
              </>
            )}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors group-hover:bg-gray-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Preview & Apply
        </div>
      </div>
    </button>
  );
}
