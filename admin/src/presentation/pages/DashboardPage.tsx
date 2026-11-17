import { useMemo, useState } from 'react';
import {
  LayoutTemplate,
  Globe,
  FileText,
  Crown,
  ArrowUpRight,
  Plus,
  Activity,
  ExternalLink,
  Waypoints,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  Sparkles,
  Eye,
  CheckCircle2,
  Zap,
  Palette,
  Type,
  Gamepad2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats.ts';
import { useTemplates } from '../hooks/useTemplates.ts';
import { Header } from '../components/layout/Header.tsx';
import { useThemeTokens } from '../theme/ThemeProvider.tsx';
import { TemplateCategoryLabels } from '../../domain/template/value-objects/TemplateCategory.ts';

/* ── Timeframe Telemetry Datasets ── */
const TELEMETRY_SERIES = {
  '7d': {
    label: '7 Ngày qua',
    totalPreviews: '3,840',
    totalDetails: '2,190',
    growth: '+28.4%',
    avgLatency: '36ms',
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    previews: [420, 495, 460, 580, 640, 590, 655],
    details: [240, 290, 275, 330, 385, 320, 350],
  },
  '30d': {
    label: '30 Ngày qua',
    totalPreviews: '14,820',
    totalDetails: '8,640',
    growth: '+34.2%',
    avgLatency: '39ms',
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Hiện tại'],
    previews: [1520, 1780, 1690, 2140, 2390, 2580, 2720],
    details: [920, 1080, 1020, 1290, 1410, 1420, 1500],
  },
  '90d': {
    label: '90 Ngày qua',
    totalPreviews: '42,910',
    totalDetails: '24,150',
    growth: '+51.6%',
    avgLatency: '41ms',
    labels: ['Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Đầu T11', 'Hiện tại'],
    previews: [3900, 4600, 5250, 6100, 6980, 7720, 8360],
    details: [2200, 2650, 3010, 3420, 3950, 4320, 4600],
  },
} as const;

/* ── Monochromatic Token Opacity Scale for Donut Chart ── */
const DONUT_TOKEN_SHADES = [
  'rgb(var(--brand))',
  'rgb(var(--brand) / 0.72)',
  'rgb(var(--brand-secondary))',
  'rgb(var(--brand) / 0.44)',
  'rgb(var(--ink-muted) / 0.45)',
];

function buildSmoothPath(
  values: readonly number[],
  width: number,
  height: number,
  maxVal: number,
): string {
  const padX = 18;
  const padY = 22;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const pts = values.map((v, i) => ({
    x: padX + (i / (values.length - 1)) * usableW,
    y: padY + usableH - (v / maxVal) * usableH,
  }));

  return pts.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = arr[i - 1];
    const cx = ((prev.x + pt.x) / 2).toFixed(1);
    return `${acc} C ${cx} ${prev.y.toFixed(1)}, ${cx} ${pt.y.toFixed(1)}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');
}

export function DashboardPage() {
  const { stats, loading } = useDashboardStats();
  const { templates } = useTemplates();
  const {
    presets,
    presetId,
    activeHex,
    fontScale,
    fontScales,
    selectPreset,
    setCustomHex,
    setFontScale,
  } = useThemeTokens();
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeNodeId, setActiveNodeId] = useState<string>('preview');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [spotlightCat, setSpotlightCat] = useState<string>('all');

  const totalCount = stats?.total ?? 16;
  const publishedCount = stats?.published ?? 16;

  const dataFlowNodes = useMemo(
    () =>
      [
        {
          id: 'ui',
          step: '01',
          title: 'Presentation UI',
          sub: 'React 19 · Token Glass',
          badge: '6 Pages',
          icon: Sparkles,
          throughput: '60 FPS Render',
          modules: 'DashboardPage, TemplateListPage, RoutesPage, ThemeProvider',
          desc: 'Giao diện Glassmorphism tiêu thụ trực tiếp biến màu & cỡ chữ gốc (--brand, --base-font-size) giúp đồng bộ toàn cục.',
        },
        {
          id: 'app',
          step: '02',
          title: 'Application Layer',
          sub: '7 UseCases · DTOs',
          badge: 'SOLID',
          icon: Cpu,
          throughput: '< 0.8ms Exec',
          modules: 'ListTemplates, CreateTemplate, PublishTemplate, TemplateMapper',
          desc: 'Điều phối luồng nghiệp vụ thông qua DIContainer singleton và ánh xạ dữ liệu Domain ⇄ DTO.',
        },
        {
          id: 'domain',
          step: '03',
          title: 'Domain Core',
          sub: 'Entities · Value Objects',
          badge: 'Pure TS',
          icon: Layers,
          throughput: '100% Type-Safe',
          modules: 'Template Entity, TemplateId, TemplateCategory, TemplateStatus',
          desc: 'Bảo toàn quy tắc nghiệp vụ cốt lõi độc lập hoàn toàn với framework và cơ sở dữ liệu.',
        },
        {
          id: 'infra',
          step: '04',
          title: 'Persistence Cache',
          sub: 'LocalStorage + Seed JSON',
          badge: `${totalCount} Records`,
          icon: Database,
          throughput: '0.2ms Read Cache',
          modules: 'LocalStorageTemplateRepository, templates-seed.json',
          desc: 'Đồng bộ tức thì trạng thái kho giao diện với in-memory cache và khôi phục tự động từ JSON seed.',
        },
        {
          id: 'preview',
          step: '05',
          title: 'Isolated Preview Engine',
          sub: 'Static Guard · HTTP 200',
          badge: `${publishedCount}/${totalCount} Live`,
          icon: Globe,
          throughput: '38ms Avg TTFB',
          modules: 'templatesStaticGuardPlugin, /templates/*/*/index.html',
          desc: `Phục vụ độc lập ${totalCount} ứng dụng HTML/Tailwind/SVG thực tế — cô lập hoàn toàn khỏi SPA Fallback.`,
        },
      ] as const,
    [publishedCount, totalCount],
  );

  const activeSeries = TELEMETRY_SERIES[timeframe];
  const activeNode = dataFlowNodes.find(n => n.id === activeNodeId) ?? dataFlowNodes[4];

  const spotlightTemplates = useMemo(() => {
    const list =
      spotlightCat === 'all'
        ? templates
        : templates.filter(t => t.category === spotlightCat);
    return list.slice(0, 6);
  }, [templates, spotlightCat]);

  const donutSegments = useMemo(() => {
    const total = stats?.total || 1;
    const circumference = 2 * Math.PI * 52;
    let offset = 0;
    const sorted = [...(stats?.byCategory ?? [])]
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    return sorted.map((item, idx) => {
      const fraction = item.count / total;
      const len = fraction * circumference;
      const seg = {
        ...item,
        pct: Math.round(fraction * 100),
        dashArray: `${Math.max(0, len - 3)} ${circumference}`,
        dashOffset: -offset,
        color: DONUT_TOKEN_SHADES[idx % DONUT_TOKEN_SHADES.length],
      };
      offset += len;
      return seg;
    });
  }, [stats]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Activity className="h-7 w-7 text-brand animate-pulse" />
      </div>
    );
  }

  const chartW = 680;
  const chartH = 230;
  const maxChartVal = Math.max(...activeSeries.previews) * 1.15;
  const previewLine = buildSmoothPath(activeSeries.previews, chartW, chartH, maxChartVal);
  const previewArea = `${previewLine} L ${chartW - 18} ${chartH - 22} L 18 ${chartH - 22} Z`;
  const detailLine = buildSmoothPath(activeSeries.details, chartW, chartH, maxChartVal);
  const detailArea = `${detailLine} L ${chartW - 18} ${chartH - 22} L 18 ${chartH - 22} Z`;

  const inspectIdx = hoveredIdx ?? activeSeries.previews.length - 1;

  const kpiCards = [
    {
      label: 'Tổng Kho Templates',
      value: totalCount,
      delta: '+100% Ready',
      icon: LayoutTemplate,
      isPositive: false,
      spark: 'M 4 28 C 18 26, 28 20, 42 21 C 56 22, 68 12, 84 14 C 96 15, 108 6, 120 4',
    },
    {
      label: 'Đang Xuất Bản (Live)',
      value: publishedCount,
      delta: 'HTTP 200 OK',
      icon: Globe,
      isPositive: true,
      spark: 'M 4 26 C 20 24, 32 18, 48 16 C 64 14, 78 15, 94 9 C 106 6, 114 5, 120 3',
    },
    {
      label: 'Phiên Bản Premium',
      value: stats?.premium ?? 10,
      delta: 'Enterprise',
      icon: Crown,
      isPositive: false,
      spark: 'M 4 27 C 18 22, 34 25, 50 17 C 66 10, 82 14, 98 8 C 108 5, 115 6, 120 4',
    },
    {
      label: 'Bản Nháp & Lưu Trữ',
      value: (stats?.draft ?? 0) + (stats?.archived ?? 0),
      delta: 'Clean Queue',
      icon: FileText,
      isPositive: false,
      spark: 'M 4 16 C 22 16, 36 18, 52 17 C 68 16, 84 19, 100 18 C 110 18, 116 18, 120 18',
    },
    {
      label: 'Độ Trễ Preview TB',
      value: activeSeries.avgLatency,
      delta: 'Zero Fallback',
      icon: Zap,
      isPositive: true,
      spark: 'M 4 10 C 20 12, 36 11, 52 16 C 68 20, 84 19, 100 22 C 110 24, 116 23, 120 25',
    },
  ];

  return (
    <div className="min-h-full">
      <Header
        title="Command Center"
        subtitle="Nordic Light Glass · Kiến trúc Design Token đồng nhất, biểu đồ dữ liệu & luồng DDD"
      />

      <div className="p-6 lg:p-7 space-y-6">
        {/* ══════════════════════════════════════════════════════════════════
            ROW 1: CLEAN EXECUTIVE GLASS HERO + LIVE TOKEN BAR + 3D PREVIEW STACK
        ══════════════════════════════════════════════════════════════════ */}
        <div className="glass bento-hover rounded-3xl p-6 lg:p-8 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 right-16 h-72 w-72 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgb(var(--brand) / 0.10) 0%, transparent 70%)',
            }}
          />

          {/* Top Bar: Instant 1-Click Design Token & Font Scale Switcher */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3.5 mb-6 pb-5 border-b border-line">
            <div className="flex items-center gap-2.5">
              <Palette className="h-[18px] w-[18px] text-brand" />
              <span className="text-sm font-semibold text-ink">
                Design Token <code className="font-mono text-brand">--brand</code>:
              </span>
              <span className="text-sm text-ink-muted hidden xl:inline">
                Đổi 1 token — cập nhật tức thì toàn bộ màu nhấn &amp; cỡ chữ
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {presets.map(p => {
                const isSelected =
                  presetId === p.id && activeHex.toLowerCase() === p.brandHex.toLowerCase();
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPreset(p.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-brand/50 bg-brand/10 text-brand-strong shadow-sm'
                        : 'border-line bg-elevated/80 text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: p.brandHex }}
                    />
                    {p.name}
                  </button>
                );
              })}

              {/* Custom Hex Input */}
              <label
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-elevated px-3 py-1.5 text-xs font-mono font-semibold text-ink cursor-pointer hover:border-brand/40"
                title="Chọn bất kỳ mã màu tùy chỉnh nào"
              >
                <input
                  type="color"
                  value={activeHex}
                  onChange={e => setCustomHex(e.target.value)}
                  className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
                />
                {activeHex.toUpperCase()}
              </label>

              {/* Quick Typography Scale Toggle */}
              <div className="hidden md:inline-flex items-center gap-1 rounded-xl border border-line bg-elevated/80 p-1">
                <Type className="h-3.5 w-3.5 text-brand ml-1.5 mr-0.5" />
                {fontScales.map(fs => (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => setFontScale(fs.id)}
                    title={fs.desc}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                      fontScale === fs.id
                        ? 'bg-brand text-brand-fg shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {fs.px}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Copy & Telemetry Pills */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                  System Online · {publishedCount}/{totalCount} Endpoints Verified
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-[2.125rem] font-bold tracking-tight text-ink leading-[1.2]">
                Trung tâm Quản trị &amp; Phân phối{' '}
                <span className="text-brand">Landing Page &amp; Dashboard</span>
              </h2>

              <p className="text-[0.96875rem] leading-relaxed text-ink-secondary max-w-2xl">
                Thiết kế chuẩn <strong>90% Trung tính + 10% Màu nhấn Token</strong> cùng thang chữ{' '}
                <strong>WCAG AA (16px–18px)</strong> dễ đọc. Toàn bộ{' '}
                <strong className="text-ink">{totalCount} giao diện thực tế</strong> được cô lập qua
                Static Middleware, sẵn sàng mở độc lập sang tab mới.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button onClick={() => navigate('/templates/new')} className="btn-primary btn-md">
                  <Plus className="h-[18px] w-[18px]" />
                  Tạo Template Mới
                </button>
                <button
                  onClick={() => navigate('/routes')}
                  className="preview-open-btn"
                  style={{ minHeight: '2.625rem', fontSize: '0.90625rem', padding: '0.625rem 1.15rem' }}
                >
                  <Waypoints className="h-[18px] w-[18px]" />
                  Kiểm tra Routes &amp; HTTP
                </button>
                <button onClick={() => navigate('/templates')} className="btn-ghost btn-md">
                  <Eye className="h-[18px] w-[18px]" />
                  Duyệt Kho Giao Diện
                </button>
                <button onClick={() => navigate('/entertainment')} className="btn-ghost btn-md">
                  <Gamepad2 className="h-[18px] w-[18px] text-brand" />
                  Góc Giải Trí 3D
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3.5 pt-2 max-w-2xl">
                {[
                  { k: 'TOKEN ENGINE', v: activeHex.toUpperCase(), sub: 'Single CSS Variable' },
                  { k: 'STATIC GUARD', v: '100% HTTP 200', sub: 'Zero SPA Leak' },
                  { k: 'TYPOGRAPHY', v: 'WCAG AA Scale', sub: 'Space Grotesk + Inter' },
                ].map(item => (
                  <div key={item.k} className="glass-subcard px-4 py-3">
                    <p className="text-xs font-mono font-bold tracking-wider text-ink-muted">
                      {item.k}
                    </p>
                    <p className="font-display text-[0.9375rem] font-bold text-ink mt-1">
                      {item.v}
                    </p>
                    <p className="text-xs font-medium text-brand mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 3D Layered Preview Stack */}
            <div className="lg:col-span-5 relative h-64 sm:h-72 flex items-center justify-center group py-2">
              <div
                onClick={() =>
                  window.open('/templates/admin-dashboard/ecotech-grid/index.html', '_blank')
                }
                className="absolute w-48 sm:w-56 rounded-2xl overflow-hidden border border-line bg-elevated shadow-lg cursor-pointer
                           transition-all duration-500 -translate-x-16 translate-y-3 -rotate-6 opacity-85
                           group-hover:-translate-x-24 group-hover:-rotate-12 group-hover:opacity-100"
              >
                <img
                  src="/thumbnails/tpl-011.svg"
                  alt="VERDANT EcoTech"
                  className="w-full aspect-video object-cover"
                />
                <div className="bg-elevated px-3 py-2 flex items-center justify-between border-t border-line">
                  <span className="font-display text-xs font-bold text-ink truncate">
                    VERDANT Eco-Tech
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">LIVE</span>
                </div>
              </div>

              <div
                onClick={() =>
                  window.open('/templates/admin-dashboard/nova-fintech/index.html', '_blank')
                }
                className="absolute w-48 sm:w-56 rounded-2xl overflow-hidden border border-line bg-elevated shadow-lg cursor-pointer
                           transition-all duration-500 translate-x-16 translate-y-3 rotate-6 opacity-85
                           group-hover:translate-x-24 group-hover:rotate-12 group-hover:opacity-100"
              >
                <img
                  src="/thumbnails/tpl-013.svg"
                  alt="QUANTUM VAULT"
                  className="w-full aspect-video object-cover"
                />
                <div className="bg-elevated px-3 py-2 flex items-center justify-between border-t border-line">
                  <span className="font-display text-xs font-bold text-ink truncate">
                    QUANTUM Fintech
                  </span>
                  <span className="text-xs font-mono font-bold text-brand">PRO</span>
                </div>
              </div>

              <div
                onClick={() =>
                  window.open('/templates/admin-dashboard/medglass-health/index.html', '_blank')
                }
                className="relative z-10 w-60 sm:w-72 rounded-2xl overflow-hidden border border-brand/35 bg-elevated cursor-pointer
                           animate-float-slow transition-transform duration-500 group-hover:scale-105 shadow-2xl"
              >
                <img
                  src="/thumbnails/tpl-012.svg"
                  alt="AETHER MED"
                  className="w-full aspect-video object-cover"
                />
                <div className="bg-elevated px-4 py-3 flex items-center justify-between border-t border-line">
                  <div>
                    <p className="font-display text-sm font-bold text-ink leading-none">
                      AETHER MED Clinical AI
                    </p>
                    <p className="text-xs font-medium text-brand mt-1">
                      Click mở Preview trực tiếp
                    </p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 border border-brand/25 text-brand">
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ROW 2: 5 UNIFORM NEUTRAL GLASS KPI CARDS WITH TOKEN SPARKLINES
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="kpi-card bento-hover rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-brand">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${
                      kpi.isPositive
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                        : 'border-line bg-elevated text-ink-muted'
                    }`}
                  >
                    {kpi.delta}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="font-display text-[1.75rem] font-bold text-ink tracking-tight leading-none">
                      {kpi.value}
                    </p>
                    <p className="text-sm font-medium text-ink-muted mt-1.5">{kpi.label}</p>
                  </div>

                  {/* Token-Driven Sparkline */}
                  <svg viewBox="0 0 124 32" className="w-24 h-8 flex-shrink-0 overflow-visible">
                    <defs>
                      <linearGradient id={`tokenKpiGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${kpi.spark} L 120 32 L 4 32 Z`} fill={`url(#tokenKpiGrad-${idx})`} />
                    <path
                      d={kpi.spark}
                      fill="none"
                      stroke="rgb(var(--brand))"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ROW 3: DISCIPLINED TOKEN-DRIVEN DDD DATA FLOW PIPELINE
        ══════════════════════════════════════════════════════════════════ */}
        <div className="glass bento-hover rounded-3xl p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <Waypoints className="h-5 w-5 text-brand" />
                <h3 className="font-display text-lg font-bold text-ink">
                  Luồng Dữ Liệu Hệ Thống (Interactive DDD &amp; Preview Data Flow)
                </h3>
                <span className="chip-brand text-xs font-mono">REALTIME PIPELINE</span>
              </div>
              <p className="text-sm mt-1 text-ink-muted">
                Nhấn vào từng tầng kiến trúc để kiểm tra module xử lý, tốc độ phản hồi và cơ chế cô lập Static HTML
              </p>
            </div>

            <button onClick={() => navigate('/routes')} className="btn-ghost btn-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Kiểm tra {publishedCount}/{totalCount} Endpoints
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            {/* Single-Hue Token Flow Stream */}
            <svg
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              className="hidden lg:block pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2 h-14 w-[calc(100%-4rem)] z-0"
            >
              <line x1="20" y1="30" x2="980" y2="30" stroke="rgb(var(--line))" strokeWidth="2" />
              <line
                x1="20"
                y1="30"
                x2="980"
                y2="30"
                stroke="rgb(var(--brand))"
                strokeOpacity="0.65"
                strokeWidth="2.5"
                className="animate-flow-dash"
              />
              <circle r="5" fill="rgb(var(--brand))">
                <animateMotion dur="3.6s" repeatCount="indefinite" path="M 20 30 L 980 30" />
              </circle>
              <circle r="5" fill="rgb(var(--brand-secondary))">
                <animateMotion dur="3.6s" begin="1.8s" repeatCount="indefinite" path="M 20 30 L 980 30" />
              </circle>
            </svg>

            <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {dataFlowNodes.map(node => {
                const NodeIcon = node.icon;
                const isSelected = node.id === activeNodeId;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    style={{ padding: '20px' }}
                    className={`text-left rounded-2xl p-5 transition-all duration-200 cursor-pointer relative overflow-hidden border bg-elevated ${
                      isSelected
                        ? 'border-brand shadow-md ring-2 ring-brand/15'
                        : 'border-line hover:border-brand/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-brand text-brand-fg'
                            : 'bg-brand/10 text-brand-strong'
                        }`}
                      >
                        STEP {node.step}
                      </span>
                      <span className="text-xs font-mono font-semibold text-ink-muted">
                        {node.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-canvas text-brand flex-shrink-0">
                        <NodeIcon className="h-[18px] w-[18px]" />
                      </div>
                      <p className="font-display text-[0.9375rem] font-bold text-ink leading-snug">
                        {node.title}
                      </p>
                    </div>

                    <p className="text-[0.8125rem] text-ink-muted truncate">{node.sub}</p>

                    <div className="mt-3 pt-2.5 border-t border-line flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-brand-strong">
                        {node.throughput}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isSelected ? 'bg-brand' : 'bg-ink-muted/40'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 glass-subcard px-5 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                <span className="font-display text-sm font-bold text-ink">
                  Tầng đang chọn: {activeNode.step} · {activeNode.title}
                </span>
                <code className="chip-brand text-xs font-mono py-0.5">
                  {activeNode.modules}
                </code>
              </div>
              <p className="text-sm leading-relaxed text-ink-secondary">{activeNode.desc}</p>
            </div>

            <div className="text-right ml-auto">
              <p className="text-xs font-mono font-bold uppercase text-ink-muted">
                Hiệu năng tầng
              </p>
              <p className="font-display text-base font-bold text-emerald-600 mt-0.5">
                {activeNode.throughput}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ROW 4: MONOCHROMATIC / DUOTONE TOKEN DATA VISUALIZATION CHARTS
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Clean Duotone Area Chart */}
          <div className="glass bento-hover rounded-3xl p-6 lg:p-7 lg:col-span-8 flex flex-col justify-between">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Lưu lượng Mở Trang Preview &amp; Tương tác Template
                </h3>
                <p className="text-sm mt-1 text-ink-muted">
                  Biểu đồ trực quan theo biến màu Token ({activeSeries.label})
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-line bg-elevated p-1">
                {(['7d', '30d', '90d'] as const).map(tf => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => {
                      setTimeframe(tf);
                      setHoveredIdx(null);
                    }}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                      timeframe === tf
                        ? 'bg-brand text-brand-fg shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3.5 mb-5">
              <div className="glass-subcard px-4 py-3">
                <div className="flex items-center gap-2 text-[0.8125rem] text-ink-secondary font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                  Lượt Mở Trang Mới
                </div>
                <p className="font-display text-xl font-bold text-ink mt-1">
                  {activeSeries.totalPreviews}
                </p>
              </div>

              <div className="glass-subcard px-4 py-3">
                <div className="flex items-center gap-2 text-[0.8125rem] text-ink-secondary font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-muted/65" />
                  Lượt Xem Chi Tiết
                </div>
                <p className="font-display text-xl font-bold text-ink mt-1">
                  {activeSeries.totalDetails}
                </p>
              </div>

              <div className="glass-subcard px-4 py-3">
                <div className="flex items-center gap-2 text-[0.8125rem] text-ink-secondary font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Tăng Trưởng Kỳ
                </div>
                <p className="font-display text-xl font-bold text-emerald-600 mt-1">
                  {activeSeries.growth}
                </p>
              </div>
            </div>

            <div className="relative">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-56 overflow-visible">
                <defs>
                  <linearGradient id="tokenAreaPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="tokenAreaSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--ink-muted))" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="rgb(var(--ink-muted))" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[0.2, 0.45, 0.7, 0.9].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1="18"
                    y1={chartH * ratio}
                    x2={chartW - 18}
                    y2={chartH * ratio}
                    stroke="rgb(var(--line))"
                    strokeDasharray="4 4"
                  />
                ))}

                <path d={detailArea} fill="url(#tokenAreaSecondary)" />
                <path d={previewArea} fill="url(#tokenAreaPrimary)" />
                <path
                  d={detailLine}
                  fill="none"
                  stroke="rgb(var(--ink-muted) / 0.65)"
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
                <path
                  d={previewLine}
                  fill="none"
                  stroke="rgb(var(--brand))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {activeSeries.previews.map((val, i) => {
                  const x = 18 + (i / (activeSeries.previews.length - 1)) * (chartW - 36);
                  const yPreview = 22 + (chartH - 44) - (val / maxChartVal) * (chartH - 44);
                  const yDetail =
                    22 + (chartH - 44) - (activeSeries.details[i] / maxChartVal) * (chartH - 44);
                  const isActive = inspectIdx === i;

                  return (
                    <g
                      key={activeSeries.labels[i]}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {isActive && (
                        <line
                          x1={x}
                          y1="14"
                          x2={x}
                          y2={chartH - 22}
                          stroke="rgb(var(--brand) / 0.4)"
                          strokeDasharray="3 3"
                        />
                      )}
                      <rect x={x - 28} y="0" width="56" height={chartH} fill="transparent" />

                      <circle
                        cx={x}
                        cy={yDetail}
                        r={isActive ? 4.5 : 3}
                        fill="rgb(var(--surface-elevated))"
                        stroke="rgb(var(--ink-muted))"
                        strokeWidth="2"
                      />
                      <circle
                        cx={x}
                        cy={yPreview}
                        r={isActive ? 6 : 4}
                        fill={isActive ? 'rgb(var(--brand))' : 'rgb(var(--surface-elevated))'}
                        stroke="rgb(var(--brand))"
                        strokeWidth="2.6"
                      />
                      <text
                        x={x}
                        y={chartH - 3}
                        textAnchor="middle"
                        fill={isActive ? 'rgb(var(--ink))' : 'rgb(var(--ink-muted))'}
                        fontSize="12"
                        fontWeight={isActive ? '700' : '500'}
                        fontFamily="monospace"
                      >
                        {activeSeries.labels[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="mt-3 flex items-center justify-between glass-subcard px-4 py-2.5 text-sm">
                <span className="text-ink-muted">
                  Mốc đang xem:{' '}
                  <strong className="text-ink font-mono">{activeSeries.labels[inspectIdx]}</strong>
                </span>
                <div className="flex items-center gap-5 font-mono">
                  <span className="text-brand-strong">
                    Mở trang: <strong>{activeSeries.previews[inspectIdx].toLocaleString()}</strong>
                  </span>
                  <span className="text-ink-secondary">
                    Chi tiết: <strong>{activeSeries.details[inspectIdx].toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Monochromatic Token Donut Ring */}
          <div className="glass bento-hover rounded-3xl p-6 lg:p-7 lg:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Tỷ trọng Danh mục</h3>
              <p className="text-sm mt-1 text-ink-muted">
                Thang sắc độ đơn sắc theo màu gốc <code className="font-mono">--brand</code>
              </p>
            </div>

            <div className="my-5 flex items-center justify-center relative">
              <svg viewBox="0 0 140 140" className="w-44 h-44 -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r="52"
                  fill="none"
                  stroke="rgb(var(--line))"
                  strokeWidth="14"
                />
                {donutSegments.map(seg => (
                  <circle
                    key={seg.category}
                    cx="70"
                    cy="70"
                    r="52"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 cursor-pointer hover:opacity-80"
                    onClick={() => navigate(`/templates?category=${seg.category}`)}
                  />
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-ink">
                  {totalCount}
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mt-0.5">
                  Templates
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {donutSegments.map(seg => (
                <button
                  key={seg.category}
                  type="button"
                  onClick={() => navigate(`/templates?category=${seg.category}`)}
                  className="w-full group flex items-center justify-between gap-3 glass-subcard px-4 py-2.5 hover:border-brand/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ background: seg.color }}
                    />
                    <span className="text-sm font-semibold text-ink-secondary truncate group-hover:text-ink">
                      {TemplateCategoryLabels[seg.category as keyof typeof TemplateCategoryLabels] ??
                        seg.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 font-mono flex-shrink-0">
                    <span className="text-sm font-bold text-ink">{seg.count}</span>
                    <span className="text-xs font-semibold text-ink-muted w-9 text-right">
                      {seg.pct}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ROW 5: VISUAL TEMPLATE SPOTLIGHT GALLERY
        ══════════════════════════════════════════════════════════════════ */}
        <div className="glass rounded-3xl p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">
                Thư viện Giao diện Nổi bật (Live Visual Showcase)
              </h3>
              <p className="text-sm mt-1 text-ink-muted">
                Trải nghiệm trực tiếp các bản thiết kế Bento Grid &amp; Visual Data — bấm Mở trang để kiểm thử độc lập
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Nổi bật' },
                { id: 'saas', label: 'SaaS' },
                { id: 'finance', label: 'Finance' },
                { id: 'e-commerce', label: 'E-commerce' },
                { id: 'business', label: 'Business' },
                { id: 'technology', label: 'Technology' },
                { id: 'esg', label: 'ESG' },
              ].map(pill => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSpotlightCat(pill.id)}
                  className={`rounded-xl px-3.5 py-2 text-[0.84375rem] font-semibold transition-all cursor-pointer border ${
                    spotlightCat === pill.id
                      ? 'border-brand bg-brand text-brand-fg shadow-sm'
                      : 'border-line bg-elevated/80 text-ink-secondary hover:text-ink'
                  }`}
                >
                  {pill.label}
                </button>
              ))}

              <button onClick={() => navigate('/templates')} className="btn-ghost btn-sm ml-1">
                Xem tất cả
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {spotlightTemplates.map(tpl => (
              <div key={tpl.id} className="template-card group flex flex-col">
                <div
                  onClick={() => navigate(`/templates/${tpl.id}`)}
                  className="relative aspect-video overflow-hidden bg-canvas border-b border-line cursor-pointer"
                >
                  <img
                    src={tpl.thumbnailUrl}
                    alt={tpl.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className="badge-published">Live 200</span>
                    {tpl.isPremium && (
                      <span className="badge-premium flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-3.5">
                  <div>
                    <h4
                      onClick={() => navigate(`/templates/${tpl.id}`)}
                      className="font-display text-[1.0625rem] font-bold text-ink group-hover:text-brand transition-colors truncate cursor-pointer"
                    >
                      {tpl.name}
                    </h4>
                    <p className="text-sm line-clamp-2 leading-relaxed text-ink-secondary mt-1.5">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3.5 border-t border-line">
                    <span className="chip-brand">
                      {TemplateCategoryLabels[tpl.category as keyof typeof TemplateCategoryLabels] ??
                        tpl.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/templates/${tpl.id}`)}
                        className="btn-ghost btn-sm"
                      >
                        <Eye className="h-4 w-4" />
                        Chi tiết
                      </button>
                      <button
                        onClick={() => window.open(tpl.previewUrl, '_blank', 'noopener,noreferrer')}
                        className="preview-open-btn"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Mở trang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ROW 6: RELAX & ENTERTAINMENT HUB (4 MINI GAMES)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="glass rounded-3xl p-6 lg:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-ink">
                  Góc Giải Trí 3D · Không Gian Xả Stress
                </h3>
                <span className="chip-brand">4 Mini Games · WebGL + WebAudio</span>
              </div>
              <p className="text-sm text-ink-muted mt-1">
                Đầy đủ từ hành động sinh tồn InstancedMesh tốc độ cao đến góc Lo-fi cây Bonsai, hồ cá Koi và nuôi mèo 3D
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/entertainment')}
              className="btn-ghost btn-sm"
            >
              <Gamepad2 className="h-4 w-4 text-brand" />
              Mở Kệ Giải Trí (4)
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 0: Poly Survivor 3D */}
            <div className="glass-subcard p-5 flex flex-col justify-between gap-4 hover:border-brand/40 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/15 border border-brand/25 text-2xl">
                  ⚔️
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-base font-bold text-ink">
                      Poly Survivor 3D
                    </h4>
                    <span className="badge-published">Mới</span>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Sinh tồn giữa biển quái vật Low-Poly bằng Đạn đa tia, Vòng lửa &amp; Sấm sét với hiệu năng InstancedMesh 60 FPS.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() =>
                    window.open('/games/poly-survivor-3d.html', '_blank', 'noopener,noreferrer')
                  }
                  className="preview-open-btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tab riêng
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/entertainment?game=poly-survivor')}
                  className="btn-primary btn-sm"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Chơi ngay
                </button>
              </div>
            </div>

            {/* Card 1: Bonsai Terrarium 3D */}
            <div className="glass-subcard p-5 flex flex-col justify-between gap-4 hover:border-brand/40 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/15 border border-brand/25 text-2xl">
                  🪴
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-base font-bold text-ink">
                      Bonsai Terrarium 3D
                    </h4>
                    <span className="badge-published">Mới</span>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Tưới sương, tỉa cành, bật đèn sưởi ấm và ngắm mưa rơi ngoài cửa sổ kèm nhạc Lo-fi Chillhop êm dịu.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() =>
                    window.open('/games/bonsai-terrarium-3d.html', '_blank', 'noopener,noreferrer')
                  }
                  className="preview-open-btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tab riêng
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/entertainment?game=bonsai-3d')}
                  className="btn-primary btn-sm"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Chơi ngay
                </button>
              </div>
            </div>

            {/* Card 2: Zen Koi Pond 3D */}
            <div className="glass-subcard p-5 flex flex-col justify-between gap-4 hover:border-brand/40 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/15 border border-brand/25 text-2xl">
                  🎏
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-base font-bold text-ink">
                      Zen Koi Pond 3D
                    </h4>
                    <span className="chip">Thiền</span>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Chạm mặt nước tạo sóng 3D, rải cám gọi đàn cá Koi 5 sắc màu tụ lại kèm tiếng suối tre &amp; chuông gió.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() =>
                    window.open('/games/zen-koi-3d.html', '_blank', 'noopener,noreferrer')
                  }
                  className="preview-open-btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tab riêng
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/entertainment?game=zen-koi')}
                  className="btn-primary btn-sm"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Chơi ngay
                </button>
              </div>
            </div>

            {/* Card 3: Meow 3D */}
            <div className="glass-subcard p-5 flex flex-col justify-between gap-4 hover:border-brand/40 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/15 border border-brand/25 text-2xl">
                  🐱
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-base font-bold text-ink">
                      Meow 3D — Mèo Cưng
                    </h4>
                    <span className="chip">Virtual Pet</span>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Vuốt ve mèo 3D nghe tiếng gừ gừ, chiếu đèn Laser, tung bóng len vật lý và diện phụ kiện đáng yêu.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() =>
                    window.open('/games/meow-3d.html', '_blank', 'noopener,noreferrer')
                  }
                  className="preview-open-btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tab riêng
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/entertainment?game=meow-3d')}
                  className="btn-primary btn-sm"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Chơi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
