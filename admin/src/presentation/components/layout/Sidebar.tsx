import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard,
  LayoutTemplate,
  Waypoints,
  Settings,
  Layers,
  Cloud,
  Landmark,
  ShoppingBag,
  Building2,
  HeartPulse,
  GraduationCap,
  Cpu,
  Truck,
  Leaf,
  Palette,
  ChevronLeft,
  X,
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDashboardStats } from '../../hooks/useDashboardStats.ts';
import { useThemeTokens } from '../../theme/ThemeProvider.tsx';
import { useSidebar } from './SidebarContext.tsx';
import { cn } from '../../../shared/utils/cn.ts';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/templates', icon: LayoutTemplate, label: 'Kho Templates' },
  { to: '/routes', icon: Waypoints, label: 'Routes & Flow' },
  { to: '/settings', icon: Settings, label: 'Cài đặt & Tokens' },
];

const categoryItems = [
  { category: 'saas',       to: '/templates?category=saas',       icon: Cloud,         label: 'SaaS' },
  { category: 'finance',    to: '/templates?category=finance',    icon: Landmark,      label: 'Finance' },
  { category: 'e-commerce', to: '/templates?category=e-commerce', icon: ShoppingBag,   label: 'E-commerce' },
  { category: 'business',   to: '/templates?category=business',   icon: Building2,     label: 'Business' },
  { category: 'healthcare', to: '/templates?category=healthcare', icon: HeartPulse,    label: 'Healthcare' },
  { category: 'education',  to: '/templates?category=education',  icon: GraduationCap, label: 'Education' },
  { category: 'technology', to: '/templates?category=technology', icon: Cpu,           label: 'Technology' },
  { category: 'logistics',  to: '/templates?category=logistics',  icon: Truck,         label: 'Logistics' },
  { category: 'esg',        to: '/templates?category=esg',        icon: Leaf,          label: 'ESG' },
];

interface TooltipState {
  label: string;
  badge?: string | number;
  top: number;
  left: number;
}

export function Sidebar() {
  const location = useLocation();
  const { stats } = useDashboardStats();
  const { activeHex, presets, presetId } = useThemeTokens();
  const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebar();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const currentPreset = presets.find(p => p.id === presetId);

  const activeCategory =
    location.pathname === '/templates'
      ? new URLSearchParams(location.search).get('category')
      : null;

  const countMap = new Map<string, number>();
  stats?.byCategory.forEach(({ category, count }) => {
    countMap.set(category, count);
  });

  const showRailTooltip = (
    e: React.MouseEvent<HTMLElement>,
    label: string,
    badge?: string | number,
  ) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      badge,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const hideRailTooltip = () => {
    if (tooltip) setTooltip(null);
  };

  return (
    <>
      <aside
        style={{
          transition:
            'width 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 340ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'width, transform',
        }}
        className={cn(
          'sidebar fixed inset-y-0 left-0 z-40 flex h-screen flex-shrink-0 flex-col select-none lg:relative lg:translate-x-0',
          collapsed ? 'lg:w-[80px] w-[272px]' : 'w-[272px]',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none',
        )}
      >
        {/* Tactile Floating Collapse Handle on Right Edge (Desktop) */}
        <button
          type="button"
          onClick={() => {
            setTooltip(null);
            toggleCollapsed();
          }}
          title={collapsed ? 'Mở rộng Sidebar (Ctrl+B)' : 'Thu gọn Sidebar (Ctrl+B)'}
          className="hidden lg:flex absolute -right-3.5 top-[58px] z-50 h-7 w-7 items-center justify-center rounded-full border border-brand/30 bg-elevated text-ink-secondary hover:border-brand hover:bg-brand hover:text-brand-fg shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              collapsed && 'rotate-180',
            )}
          />
        </button>

        {/* Brand Header */}
        <div className="flex h-[72px] items-center px-4 border-b border-line overflow-hidden">
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3 min-w-0 flex-1 rounded-xl p-1 hover:bg-elevated/50 transition-colors"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-fg flex-shrink-0 transition-transform duration-300 hover:scale-105"
              style={{ boxShadow: '0 6px 18px -4px rgb(var(--brand) / 0.42)' }}
            >
              <Layers className="h-5 w-5" />
            </div>

            <div
              className={cn(
                'min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                collapsed
                  ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-2'
                  : 'max-w-[175px] opacity-100 translate-x-0',
              )}
            >
              <p className="font-display text-[1.0625rem] font-bold tracking-tight text-ink leading-none">
                LandingHub
              </p>
              <p className="text-xs mt-1 font-medium text-ink-muted truncate">
                {currentPreset?.name ?? 'Design Tokens'}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            className="btn-ghost btn-icon lg:hidden ml-auto"
            aria-label="Đóng menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Body */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-4 flex flex-col">
          <div
            className={cn(
              'px-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              collapsed ? 'lg:h-0 lg:mb-0 lg:opacity-0' : 'h-6 mb-1.5 opacity-100',
            )}
          >
            <p className="label-xs">Điều hướng chính</p>
          </div>

          <div className="flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon, label, end }) => {
              const badgeVal = to === '/templates' ? stats?.total : undefined;
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeMobile}
                  onMouseEnter={e => showRailTooltip(e, label, badgeVal)}
                  onMouseLeave={hideRailTooltip}
                  className="block"
                >
                  {({ isActive }) => {
                    const effectiveActive = isActive && !(to === '/templates' && activeCategory);
                    return (
                      <span
                        className={cn(
                          'nav-item relative h-10 overflow-hidden',
                          collapsed ? 'lg:justify-center lg:px-0 lg:gap-0' : 'px-3.5 gap-3',
                          effectiveActive && 'nav-item-active',
                        )}
                      >
                        <span
                          className={cn(
                            'absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] rounded-r-full bg-brand transition-all duration-300',
                            effectiveActive ? 'h-5 opacity-100' : 'h-0 opacity-0',
                          )}
                        />

                        <Icon
                          className={cn(
                            'h-[18px] w-[18px] flex-shrink-0 nav-icon transition-transform duration-200',
                            effectiveActive ? 'text-brand scale-105' : 'text-ink-muted',
                          )}
                        />

                        <span
                          className={cn(
                            'truncate whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            collapsed
                              ? 'lg:hidden flex-1'
                              : 'flex-1 max-w-[175px] opacity-100 translate-x-0',
                          )}
                        >
                          {label}
                        </span>

                        {badgeVal !== undefined && (
                          <span
                            className={cn(
                              'rounded-md px-2 py-0.5 text-xs font-mono font-bold transition-all duration-200 whitespace-nowrap',
                              collapsed ? 'lg:hidden' : 'inline-block',
                              effectiveActive
                                ? 'bg-brand/15 text-brand-strong'
                                : 'bg-line/70 text-ink-secondary',
                            )}
                          >
                            {badgeVal}
                          </span>
                        )}
                      </span>
                    );
                  }}
                </NavLink>
              );
            })}
          </div>

          <div className="my-3.5 border-t border-line mx-1.5" />

          {/* Section Label: 9 Industries */}
          <div
            className={cn(
              'flex items-center justify-between px-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              collapsed ? 'lg:h-0 lg:mb-0 lg:opacity-0' : 'h-6 mb-1.5 opacity-100',
            )}
          >
            <p className="label-xs">Ngành nghề</p>
            <span className="text-xs font-mono font-semibold text-ink-muted">9 ngành</span>
          </div>

          <div className="flex flex-col gap-1">
            {categoryItems.map(({ category, to, icon: Icon, label }) => {
              const isCatActive = activeCategory === category;
              const count = countMap.get(category);

              return (
                <Link
                  key={category}
                  to={to}
                  onClick={closeMobile}
                  onMouseEnter={e => showRailTooltip(e, label, count)}
                  onMouseLeave={hideRailTooltip}
                  className="block"
                >
                  <span
                    className={cn(
                      'nav-item relative h-10 overflow-hidden',
                      collapsed ? 'lg:justify-center lg:px-0 lg:gap-0' : 'px-3.5 gap-3',
                      isCatActive && 'nav-item-active',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] rounded-r-full bg-brand transition-all duration-300',
                        isCatActive ? 'h-5 opacity-100' : 'h-0 opacity-0',
                      )}
                    />

                    <Icon
                      className={cn(
                        'h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200',
                        isCatActive ? 'text-brand scale-105' : 'text-ink-muted',
                      )}
                    />

                    <span
                      className={cn(
                        'truncate whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        collapsed
                          ? 'lg:hidden flex-1'
                          : 'flex-1 max-w-[160px] opacity-100 translate-x-0',
                      )}
                    >
                      {label}
                    </span>

                    <span
                      className={cn(
                        'flex items-center gap-1.5 flex-shrink-0 transition-all duration-200',
                        collapsed ? 'lg:hidden' : 'flex',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          isCatActive ? 'bg-brand' : 'bg-ink-muted/45',
                        )}
                      />
                      {count !== undefined && (
                        <span className="text-xs font-mono font-bold text-ink-secondary min-w-[16px] text-right">
                          {count}
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Token Status Card */}
        <Link
          to="/settings"
          onClick={closeMobile}
          onMouseEnter={e => showRailTooltip(e, 'Token Engine', activeHex.toUpperCase())}
          onMouseLeave={hideRailTooltip}
          className={cn(
            'm-3.5 mt-0 flex items-center rounded-2xl border border-brand/20 bg-brand/[0.06] hover:border-brand/40 transition-all duration-300 overflow-hidden',
            collapsed ? 'lg:p-2.5 lg:justify-center p-3 gap-3' : 'p-3 gap-3',
          )}
        >
          <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Palette className="h-4 w-4" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface"
              style={{ backgroundColor: activeHex }}
            />
          </div>

          <div
            className={cn(
              'min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              collapsed ? 'lg:hidden flex-1' : 'flex-1 max-w-[185px] opacity-100',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-sm font-bold text-ink">Token Engine</span>
              <code className="text-xs font-mono font-bold text-brand">
                {activeHex.toUpperCase()}
              </code>
            </div>
            <p className="text-xs text-ink-muted truncate mt-0.5">
              Ctrl + B để thu gọn menu
            </p>
          </div>
        </Link>
      </aside>

      {collapsed &&
        tooltip &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: `${tooltip.top}px`,
              left: `${tooltip.left}px`,
              transform: 'translateY(-50%)',
              zIndex: 99999,
            }}
            className="pointer-events-none hidden lg:flex items-center gap-2 rounded-xl border border-line bg-elevated/95 backdrop-blur-xl px-3.5 py-2 shadow-xl animate-tooltip-in"
          >
            <span className="text-sm font-semibold text-ink whitespace-nowrap">
              {tooltip.label}
            </span>
            {tooltip.badge !== undefined && (
              <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-mono font-bold text-brand-strong">
                {tooltip.badge}
              </span>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
