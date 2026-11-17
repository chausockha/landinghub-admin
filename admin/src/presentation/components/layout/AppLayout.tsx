import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { SidebarProvider, useSidebar } from './SidebarContext.tsx';
import { useThemeTokens } from '../../theme/ThemeProvider.tsx';

function LayoutShell() {
  const { mode } = useThemeTokens();
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <div className="relative flex h-screen overflow-hidden bg-canvas text-ink">
      {/* Subtle Single-Tone Architectural Crystal Refraction */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {mode === 'light' ? (
          <img
            src="/backgrounds/light-prism-bg.jpg"
            alt=""
            className="h-full w-full object-cover opacity-35 saturate-50"
          />
        ) : (
          <img
            src="/backgrounds/dashboard-aurora-bg.jpg"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
        )}

        <div
          className="absolute -top-28 left-1/4 h-[440px] w-[440px] rounded-full transition-colors duration-500"
          style={{
            background: 'radial-gradient(circle, rgb(var(--brand) / 0.11) 0%, transparent 70%)',
            filter: 'blur(36px)',
          }}
        />
        <div
          className="absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full transition-colors duration-500"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--brand-secondary) / 0.08) 0%, transparent 70%)',
            filter: 'blur(36px)',
          }}
        />
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={closeMobile}
        className={`fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div className="relative z-10 flex h-full w-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  );
}
