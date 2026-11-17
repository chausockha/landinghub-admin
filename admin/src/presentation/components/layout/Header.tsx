import {
  Plus,
  Search,
  Palette,
  Sun,
  Moon,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Type,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useThemeTokens } from '../../theme/ThemeProvider.tsx';
import { useSidebar } from './SidebarContext.tsx';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
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
  const { collapsed, toggleCollapsed, openMobile } = useSidebar();

  const [searchOpen, setSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [tokenOpen, setTokenOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  const updatePopoverCoords = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const desiredRight = Math.max(12, window.innerWidth - rect.right);
    setCoords({
      top: rect.bottom + 10,
      right: desiredRight,
    });
  }, []);

  useLayoutEffect(() => {
    if (tokenOpen) {
      updatePopoverCoords();
    }
  }, [tokenOpen, updatePopoverCoords]);

  useEffect(() => {
    if (!tokenOpen) return;

    const onOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        btnRef.current &&
        !btnRef.current.contains(t) &&
        panelRef.current &&
        !panelRef.current.contains(t)
      ) {
        setTokenOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTokenOpen(false);
    };

    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updatePopoverCoords);
    window.addEventListener('scroll', updatePopoverCoords, true);

    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updatePopoverCoords);
      window.removeEventListener('scroll', updatePopoverCoords, true);
    };
  }, [tokenOpen, updatePopoverCoords]);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    navigate(q ? `/templates?q=${encodeURIComponent(q)}` : '/templates');
    setSearchOpen(false);
  };

  return (
    <header className="topbar sticky top-0 z-30 flex h-[72px] items-center justify-between px-6 gap-4">
      {/* Left: Smooth Sidebar Toggle + Page Title */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Mobile Drawer Trigger */}
        <button
          type="button"
          onClick={openMobile}
          className="btn-ghost btn-icon lg:hidden flex-shrink-0"
          title="Mở menu điều hướng"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* Desktop Smooth Collapse Trigger */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="btn-ghost btn-icon hidden lg:inline-flex flex-shrink-0"
          title={collapsed ? 'Mở rộng Sidebar (Ctrl+B)' : 'Thu gọn Sidebar (Ctrl+B)'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px] text-brand transition-transform duration-200" />
          ) : (
            <PanelLeftClose className="h-[18px] w-[18px] transition-transform duration-200" />
          )}
        </button>

        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold text-ink leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[0.84375rem] mt-0.5 text-ink-muted truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {searchOpen ? (
          <form onSubmit={handleQuickSearchSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-ink-muted" />
            <input
              autoFocus
              value={quickQuery}
              onChange={e => setQuickQuery(e.target.value)}
              className="input-glass pl-10 pr-3.5 py-2 w-60 text-sm"
              placeholder="Tìm nhanh template..."
              onBlur={() => {
                if (!quickQuery.trim()) setSearchOpen(false);
              }}
            />
          </form>
        ) : (
          <button
            className="btn-ghost btn-icon"
            onClick={() => setSearchOpen(true)}
            title="Tìm kiếm"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        )}

        {/* Light / Dark Surface Toggle */}
        <button
          onClick={toggleMode}
          className="btn-ghost btn-icon"
          title={mode === 'light' ? 'Chuyển sang Dark Glass' : 'Chuyển sang Light Glass'}
        >
          {mode === 'light' ? (
            <Moon className="h-[18px] w-[18px]" />
          ) : (
            <Sun className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Live Design Token Picker Trigger (Color + Font Scale) */}
        <button
          ref={btnRef}
          type="button"
          onClick={() => setTokenOpen(v => !v)}
          className={`btn-ghost btn-sm ${
            tokenOpen ? 'border-brand/50 ring-2 ring-brand/15' : ''
          }`}
          title="Đổi màu & tỷ lệ chữ Design Token toàn cục"
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-black/10 flex-shrink-0"
            style={{ backgroundColor: activeHex }}
          />
          <Palette className="h-4 w-4 text-ink-muted hidden sm:block" />
          <span className="hidden md:inline text-sm font-semibold text-ink">Tokens &amp; Chữ</span>
        </button>

        {/* Add button */}
        <button onClick={() => navigate('/templates/new')} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Thêm Template</span>
        </button>

        {/* Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 rounded-xl border border-line bg-elevated/85 px-3 py-1.5 min-h-[2.375rem] cursor-pointer hover:border-brand/40 transition-all"
          title="Cài đặt hệ thống"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand text-brand-fg text-xs font-bold flex-shrink-0">
            A
          </div>
          <span className="text-sm font-semibold text-ink-secondary hidden sm:block">Admin</span>
        </div>
      </div>

      {/* Portaled Live Design Token Popover (Guaranteed Spacious Padding & Crisp Surface) */}
      {tokenOpen &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              right: `${coords.right}px`,
              width: 'min(380px, calc(100vw - 24px))',
              maxHeight: 'calc(100vh - 88px)',
              padding: '20px 22px',
              zIndex: 99999,
            }}
            className="popover-glass overflow-y-auto rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-line">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-[0.9375rem] font-bold text-ink">
                    Design Token Engine
                  </p>
                  <code className="rounded-md border border-brand/25 bg-brand/10 px-2 py-0.5 text-xs font-mono font-bold text-brand">
                    {activeHex.toUpperCase()}
                  </code>
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Đổi 1 token — cập nhật tức thì Màu sắc &amp; Cỡ chữ toàn hệ thống
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTokenOpen(false)}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-line/50 hover:text-ink transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Typography Scale Switcher */}
            <div className="mb-4 pb-4 border-b border-line">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Type className="h-3.5 w-3.5 text-brand" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Tỷ lệ cỡ chữ hệ thống
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fontScales.map(fs => {
                  const active = fontScale === fs.id;
                  return (
                    <button
                      key={fs.id}
                      type="button"
                      onClick={() => setFontScale(fs.id)}
                      className={`rounded-xl border px-3 py-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'border-brand bg-brand text-brand-fg shadow-sm'
                          : 'border-line bg-canvas/70 text-ink-secondary hover:border-brand/35 hover:text-ink'
                      }`}
                      title={fs.desc}
                    >
                      {fs.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Presets */}
            <div className="space-y-2 mb-4">
              {presets.map(p => {
                const isSelected =
                  presetId === p.id && activeHex.toLowerCase() === p.brandHex.toLowerCase();
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPreset(p.id)}
                    className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand/50 bg-brand/10 shadow-sm'
                        : 'border-line bg-canvas/55 hover:bg-canvas hover:border-brand/35'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-4 w-4 rounded-full flex-shrink-0 ring-2 ring-white/90 shadow-sm"
                        style={{ backgroundColor: p.brandHex }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink leading-snug">{p.name}</p>
                        <p className="text-xs text-ink-muted truncate mt-0.5">{p.subtitle}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-brand flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Brand Color Picker */}
            <div className="pt-3.5 border-t border-line flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
                  <span>Tùy chỉnh mã màu</span>
                  <code className="rounded border border-brand/25 bg-brand/10 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">
                    --brand
                  </code>
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Chọn bất kỳ màu nhấn nào bạn thích
                </p>
              </div>
              <label
                className="relative flex h-10 w-14 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-white/80 shadow-md ring-1 ring-line transition-transform hover:scale-105"
                style={{ backgroundColor: activeHex }}
                title="Chọn màu tùy chỉnh"
              >
                <input
                  type="color"
                  value={activeHex}
                  onChange={e => setCustomHex(e.target.value)}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
