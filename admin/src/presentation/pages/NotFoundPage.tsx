import { Compass, ArrowLeft, Home, Waypoints } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES } from '../router/routes.ts';

export function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="glass max-w-lg w-full rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10">
          <Compass className="h-7 w-7 text-brand" />
        </div>

        <span className="inline-block rounded-full border border-brand/25 bg-brand/10 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-brand-strong mb-3">
          ERROR 404 · ROUTE NOT FOUND
        </span>

        <h1 className="font-display text-2xl font-bold text-ink mb-2">
          Không tìm thấy đường dẫn này
        </h1>

        <p className="text-sm leading-relaxed text-ink-secondary mb-4">
          Route bạn truy cập không tồn tại trong hệ thống định tuyến của LandingHub:
        </p>

        <code className="block glass-subcard px-4 py-3 text-sm font-mono text-brand-strong mb-6 break-all">
          {location.pathname}
          {location.search}
        </code>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button onClick={() => navigate(-1)} className="btn-ghost btn-md">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <button onClick={() => navigate(ADMIN_ROUTES.ROUTES_MANAGER)} className="btn-ghost btn-md">
            <Waypoints className="h-4 w-4" />
            Xem Routes
          </button>
          <button onClick={() => navigate(ADMIN_ROUTES.DASHBOARD)} className="btn-primary btn-md">
            <Home className="h-4 w-4" />
            Về Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
