import { RefreshCw, Trash2, Database, Server, Palette, Check, Type } from 'lucide-react';
import { DIContainer } from '../../container/DIContainer.ts';
import { Header } from '../components/layout/Header.tsx';
import { useThemeTokens } from '../theme/ThemeProvider.tsx';

export function SettingsPage() {
  const {
    presets,
    presetId,
    activeHex,
    mode,
    fontScale,
    fontScales,
    selectPreset,
    setCustomHex,
    toggleMode,
    setFontScale,
  } = useThemeTokens();

  return (
    <div className="min-h-full">
      <Header
        title="Cài đặt & Design Tokens"
        subtitle="Quản lý biến màu CSS toàn cục (--brand), thang cỡ chữ (--base-font-size) & dữ liệu hệ thống"
      />

      <div className="p-6 lg:p-7">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Single-Point Design Token Studio */}
          <div className="glass rounded-3xl p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 border border-brand/25">
                  <Palette className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    Hệ thống Design Tokens (Single-Source Color &amp; Typography)
                  </h2>
                  <p className="text-sm text-ink-muted mt-0.5">
                    Thay đổi duy nhất biến gốc <code className="font-mono text-brand">--brand</code> và{' '}
                    <code className="font-mono text-brand">--base-font-size</code> — toàn bộ Nút, Sidebar, Input và Biểu đồ tự động cập nhật
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button onClick={toggleMode} className="btn-ghost btn-sm">
                  Nền hiện tại: <strong>{mode === 'light' ? 'Light Glass' : 'Dark Glass'}</strong>
                </button>
                <label className="inline-flex items-center gap-2 rounded-xl border border-brand/35 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand-strong cursor-pointer min-h-[2.375rem]">
                  <span>Custom Hex:</span>
                  <code className="font-mono font-bold">{activeHex.toUpperCase()}</code>
                  <input
                    type="color"
                    value={activeHex}
                    onChange={e => setCustomHex(e.target.value)}
                    className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {presets.map(p => {
                const isSelected =
                  presetId === p.id && activeHex.toLowerCase() === p.brandHex.toLowerCase();
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPreset(p.id)}
                    className={`rounded-2xl border p-5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand bg-brand/[0.08] shadow-sm ring-1 ring-brand/20'
                        : 'border-line bg-elevated/80 hover:border-brand/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3.5 w-full">
                      <span
                        className="h-6 w-6 rounded-full ring-2 ring-white shadow flex-shrink-0"
                        style={{ backgroundColor: p.brandHex }}
                      />
                      {isSelected ? (
                        <Check className="h-4 w-4 text-brand flex-shrink-0" />
                      ) : (
                        <span className="rounded-md bg-line/60 px-2 py-0.5 text-xs font-mono font-semibold text-ink-muted uppercase">
                          {p.mode}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-ink">{p.name}</p>
                      <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{p.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Typography Scale Token Row */}
            <div className="mt-7 pt-6 border-t border-line">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 border border-brand/25">
                  <Type className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    Thang Cỡ Chữ Chuẩn UI/UX (Typography Scale Token)
                  </h3>
                  <p className="text-sm text-ink-muted mt-0.5">
                    Mọi thành phần dùng đơn vị <code className="font-mono">rem</code> theo chuẩn WCAG 2.1 AA (tối thiểu 12px cho badge, 14.5px–16px cho nội dung &amp; điều hướng)
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {fontScales.map(fs => {
                  const active = fontScale === fs.id;
                  return (
                    <button
                      key={fs.id}
                      type="button"
                      onClick={() => setFontScale(fs.id)}
                      className={`rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                        active
                          ? 'border-brand bg-brand/[0.08] shadow-sm ring-1 ring-brand/20'
                          : 'border-line bg-elevated/80 hover:border-brand/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-display text-[0.9375rem] font-bold text-ink">
                          {fs.label}
                        </span>
                        {active && <Check className="h-4 w-4 text-brand" />}
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed">{fs.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Data management */}
            <div className="glass rounded-3xl p-6 lg:p-7">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 border border-brand/25">
                  <Database className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">Quản lý Dữ liệu</h2>
                  <p className="label-xs mt-0.5">LocalStorage v18 · 40 Templates Seed</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    title: 'Reset về mặc định',
                    desc: 'Khôi phục danh sách về 40 templates chuẩn ban đầu',
                    btnClass: 'btn-ghost btn-sm',
                    btnIcon: RefreshCw,
                    btnLabel: 'Reset',
                    action: () => {
                      if (window.confirm('Reset dữ liệu về mặc định?')) {
                        DIContainer.getInstance().resetStorage();
                        window.location.reload();
                      }
                    },
                  },
                  {
                    title: 'Xóa toàn bộ bộ nhớ trình duyệt',
                    desc: 'Làm sạch LocalStorage và nạp lại từ file JSON seed',
                    btnClass: 'btn-danger btn-sm',
                    btnIcon: Trash2,
                    btnLabel: 'Xóa tất cả',
                    action: () => {
                      if (window.confirm('Xóa toàn bộ dữ liệu bộ nhớ tạm?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    },
                  },
                ].map(({ title, desc, btnClass, btnIcon: BtnIcon, btnLabel, action }) => (
                  <div
                    key={title}
                    className="flex items-center justify-between gap-4 glass-subcard px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-ink">{title}</p>
                      <p className="text-[0.8125rem] mt-1 text-ink-muted">{desc}</p>
                    </div>
                    <button onClick={action} className={`${btnClass} flex-shrink-0`}>
                      <BtnIcon className="h-4 w-4" />
                      {btnLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="glass rounded-3xl p-6 lg:p-7">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 border border-brand/25">
                  <Server className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">Thông tin Kiến trúc</h2>
                  <p className="label-xs mt-0.5">Tech Stack &amp; Token Architecture</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { k: 'TOKEN GỐC', v: '--brand, --surface, --base-font-size' },
                  { k: 'MÀU NHẤN ĐANG DÙNG', v: activeHex.toUpperCase() },
                  { k: 'FRONTEND', v: 'React 19 + Vite 8 + TypeScript 7' },
                  { k: 'TYPOGRAPHY', v: 'Space Grotesk + Inter (WCAG AA 16px+)' },
                  { k: 'KIẾN TRÚC', v: 'DDD 4-Layer + SOLID + DI Singleton' },
                  { k: 'ROUTING', v: 'BrowserRouter + Static Isolation Guard' },
                ].map(({ k, v }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 glass-subcard px-4 py-3"
                  >
                    <span className="text-xs font-mono font-bold tracking-wider text-ink-muted">
                      {k}
                    </span>
                    <span className="text-sm font-semibold text-ink text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
