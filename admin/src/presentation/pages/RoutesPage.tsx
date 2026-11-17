import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Waypoints, Globe, Copy, ExternalLink, Search, CheckCheck,
  RefreshCw, Link2, CheckCircle2, AlertTriangle, ArrowUpRight,
  Crown, ShieldCheck, Activity, Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '../hooks/useTemplates.ts';
import { Header } from '../components/layout/Header.tsx';
import { ADMIN_ROUTE_MANIFEST, ADMIN_ROUTES } from '../router/routes.ts';
import { TemplateCategoryLabels } from '../../domain/template/value-objects/TemplateCategory.ts';

interface EndpointHealth {
  ok: boolean;
  status: number;
  latencyMs: number;
  checked: boolean;
}

export function RoutesPage() {
  const { templates, loading, refetch } = useTemplates();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'admin'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthMap, setHealthMap] = useState<Record<string, EndpointHealth>>({});

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const verifyEndpoints = useCallback(async () => {
    if (templates.length === 0) return;
    setCheckingHealth(true);
    const nextMap: Record<string, EndpointHealth> = {};

    await Promise.all(
      templates.map(async tpl => {
        if (!tpl.previewUrl) {
          nextMap[tpl.id] = { ok: false, status: 0, latencyMs: 0, checked: true };
          return;
        }
        const t0 = performance.now();
        try {
          const res = await fetch(tpl.previewUrl, { method: 'GET', cache: 'no-store' });
          const html = await res.text();
          const isAdminFallback =
            html.includes('<div id="root"></div>') && html.includes('/src/main.tsx');
          const latencyMs = Math.max(1, Math.round(performance.now() - t0));
          nextMap[tpl.id] = {
            ok: res.ok && !isAdminFallback,
            status: isAdminFallback ? 404 : res.status,
            latencyMs,
            checked: true,
          };
        } catch {
          nextMap[tpl.id] = {
            ok: false,
            status: 500,
            latencyMs: Math.round(performance.now() - t0),
            checked: true,
          };
        }
      }),
    );

    setHealthMap(nextMap);
    setCheckingHealth(false);
  }, [templates]);

  useEffect(() => {
    if (templates.length > 0) {
      verifyEndpoints();
    }
  }, [templates, verifyEndpoints]);

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.previewUrl.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [templates, search]);

  const filteredAdminRoutes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ADMIN_ROUTE_MANIFEST;
    return ADMIN_ROUTE_MANIFEST.filter(
      r =>
        r.path.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [search]);

  const healthStats = useMemo(() => {
    const values = Object.values(healthMap);
    const healthy = values.filter(v => v.ok).length;
    const broken = values.filter(v => v.checked && !v.ok).length;
    const avgLatency =
      values.length > 0
        ? Math.round(values.reduce((acc, v) => acc + v.latencyMs, 0) / values.length)
        : 0;
    return { healthy, broken, avgLatency };
  }, [healthMap]);

  const copyAllLiveUrls = () => {
    const lines = templates
      .filter(t => healthMap[t.id]?.ok !== false)
      .map(t => `${t.name}: ${window.location.origin}${t.previewUrl}`)
      .join('\n');
    copyText(lines, 'copy-all');
  };

  return (
    <div className="min-h-full">
      <Header
        title="Routes & Live Endpoints"
        subtitle="Hệ thống định tuyến Web Admin & giám sát HTTP trực tiếp của các HTML Templates"
      />

      <div className="p-6 lg:p-7 space-y-6">
        {/* Clean Uniform KPI Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="kpi-card rounded-2xl p-5 bento-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                <Waypoints className="h-[18px] w-[18px] text-brand" />
              </div>
              <span className="chip-brand text-xs font-mono">SPA Router</span>
            </div>
            <p className="font-display text-[1.75rem] font-bold text-ink leading-none">
              {ADMIN_ROUTE_MANIFEST.length}
            </p>
            <p className="text-sm font-medium text-ink-muted mt-1.5">Web Admin Routes</p>
          </div>

          <div className="kpi-card rounded-2xl p-5 bento-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                <Layers className="h-[18px] w-[18px] text-brand" />
              </div>
              <span className="chip text-xs font-mono">Static HTML</span>
            </div>
            <p className="font-display text-[1.75rem] font-bold text-ink leading-none">
              {templates.length}
            </p>
            <p className="text-sm font-medium text-ink-muted mt-1.5">Template Preview URLs</p>
          </div>

          <div className="kpi-card rounded-2xl p-5 bento-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <ShieldCheck className="h-[18px] w-[18px] text-emerald-600" />
              </div>
              <span className="badge-published text-xs font-mono">
                {healthStats.broken > 0 ? `${healthStats.broken} lỗi` : '100% Online'}
              </span>
            </div>
            <p className="font-display text-[1.75rem] font-bold text-ink leading-none">
              {Object.keys(healthMap).length ? `${healthStats.healthy}/${templates.length}` : '...'}
            </p>
            <p className="text-sm font-medium text-ink-muted mt-1.5">HTTP 200 Verified</p>
          </div>

          <div className="kpi-card rounded-2xl p-5 bento-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                <Activity className="h-[18px] w-[18px] text-brand" />
              </div>
              <span className="chip text-xs font-mono">Local Edge</span>
            </div>
            <p className="font-display text-[1.75rem] font-bold text-ink font-mono leading-none">
              {healthStats.avgLatency ? `${healthStats.avgLatency}ms` : '—'}
            </p>
            <p className="text-sm font-medium text-ink-muted mt-1.5">Độ trễ phản hồi TB</p>
          </div>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-line bg-elevated/80 p-1">
            {[
              { id: 'all', label: 'Tất cả Routes' },
              { id: 'admin', label: `Web Admin (${ADMIN_ROUTE_MANIFEST.length})` },
              { id: 'templates', label: `Template URLs (${templates.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`rounded-lg px-4 py-2 text-[0.84375rem] font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand/15 border border-brand/35 text-brand-strong shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo đường dẫn, tên trang hoặc danh mục..."
              className="input-glass w-full pl-10"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                refetch();
                verifyEndpoints();
              }}
              disabled={checkingHealth}
              className="btn-ghost btn-sm"
            >
              <RefreshCw className={`h-4 w-4 ${checkingHealth ? 'animate-spin text-brand' : ''}`} />
              Kiểm tra HTTP
            </button>
            <button onClick={copyAllLiveUrls} className="btn-primary btn-sm">
              {copiedId === 'copy-all' ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  Đã copy URLs
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Live URLs
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 1: Web Admin Routes */}
        {(activeTab === 'all' || activeTab === 'admin') && (
          <div className="glass rounded-3xl p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Web Admin Routes (SPA Router)
                </h2>
                <p className="text-sm mt-1 text-ink-muted">
                  Cấu trúc định tuyến sạch với BrowserRouter, hỗ trợ query filter và trang 404 tự động
                </p>
              </div>
              <span className="chip-brand">React Router v6</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredAdminRoutes.map(route => {
                const targetPath = route.samplePath ?? route.path;
                const fullUrl = `${window.location.origin}${targetPath}`;
                const isCopied = copiedId === `admin-${route.path}`;

                return (
                  <div
                    key={route.path}
                    className="group flex items-center justify-between gap-4 glass-subcard px-6 py-5 hover:border-brand/40 transition-all"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 mt-0.5">
                        <Waypoints className="h-[18px] w-[18px] text-brand" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono font-bold text-emerald-600">
                            {route.method}
                          </span>
                          <code className="text-sm font-mono font-bold text-brand-strong truncate">
                            {route.path}
                          </code>
                          {route.dynamic && (
                            <span className="chip text-xs py-0.5">Dynamic :id</span>
                          )}
                        </div>
                        <p className="text-[0.9375rem] font-bold text-ink">{route.name}</p>
                        <p className="text-[0.8125rem] truncate mt-1 text-ink-muted">
                          {route.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyText(fullUrl, `admin-${route.path}`)}
                        className="btn-ghost btn-icon"
                        title="Copy URL"
                      >
                        {isCopied ? (
                          <CheckCheck className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => navigate(targetPath)}
                        className="btn-ghost btn-icon"
                        title={`Đi tới ${targetPath}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: Template Static Preview Endpoints */}
        {(activeTab === 'all' || activeTab === 'templates') && (
          <div className="glass rounded-3xl p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Template Live Preview Endpoints
                </h2>
                <p className="text-sm mt-1 text-ink-muted">
                  Đường dẫn HTML độc lập phục vụ trực tiếp qua Static Middleware — mở trang mới không bao giờ bị rơi về Admin
                </p>
              </div>
              <span className="badge-published">Static Isolated</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm font-medium text-ink-muted">
                Đang tải danh sách routes...
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredTemplates.map(tpl => {
                  const health = healthMap[tpl.id];
                  const fullUrl = `${window.location.origin}${tpl.previewUrl}`;
                  const isCopied = copiedId === tpl.id;

                  return (
                    <div
                      key={tpl.id}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-4 glass-subcard px-6 py-4 hover:border-brand/40 transition-all"
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${
                          !health?.checked
                            ? 'border-line bg-elevated text-ink-muted'
                            : health.ok
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {!health?.checked ? (
                          <Globe className="h-[18px] w-[18px] animate-pulse" />
                        ) : health.ok ? (
                          <CheckCircle2 className="h-[18px] w-[18px]" />
                        ) : (
                          <AlertTriangle className="h-[18px] w-[18px]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-display text-[0.9375rem] font-bold text-ink">
                            {tpl.name}
                          </span>
                          <span className="chip">
                            {TemplateCategoryLabels[tpl.category as keyof typeof TemplateCategoryLabels] ?? tpl.category}
                          </span>
                          {tpl.isPremium && (
                            <span className="badge-premium inline-flex items-center gap-1">
                              <Crown className="h-3 w-3" />
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Link2 className="h-3.5 w-3.5 text-brand flex-shrink-0" />
                          <code className="text-[0.8125rem] font-mono text-ink-secondary truncate">
                            {tpl.previewUrl}
                          </code>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
                        {health?.checked && (
                          <>
                            <span
                              className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold border ${
                                health.ok
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                                  : 'border-rose-500/30 bg-rose-500/10 text-rose-600'
                              }`}
                            >
                              {health.status} {health.ok ? 'OK' : 'ERR'}
                            </span>
                            <span className="text-xs font-mono font-medium text-ink-muted w-14 text-right">
                              {health.latencyMs}ms
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                        <button
                          onClick={() => copyText(fullUrl, tpl.id)}
                          className="btn-ghost btn-sm"
                          title="Copy đường dẫn đầy đủ"
                        >
                          {isCopied ? (
                            <>
                              <CheckCheck className="h-4 w-4 text-emerald-600" />
                              Đã copy
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => window.open(tpl.previewUrl, '_blank', 'noopener,noreferrer')}
                          className="preview-open-btn"
                          title="Mở trang template trong tab mới"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Mở trang
                        </button>
                        <button
                          onClick={() => navigate(ADMIN_ROUTES.TEMPLATE_DETAIL(tpl.id))}
                          className="btn-ghost btn-icon"
                          title="Xem chi tiết trong Admin"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
