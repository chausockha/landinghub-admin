import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, AlertCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { DIContainer } from '../../container/DIContainer.ts';
import { CATEGORIES, UI_STYLES, LAYOUTS } from '../../shared/constants/categories.ts';
import { SelectGlass } from '../components/ui/select-glass.tsx';
import { useSidebar } from '../components/layout/SidebarContext.tsx';
import type { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';
import { TemplateStyle } from '../../domain/template/value-objects/TemplateStyle.ts';
import { TemplateLayout } from '../../domain/template/value-objects/TemplateLayout.ts';

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-semibold text-ink-secondary mb-1.5">{label}</label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
  </div>
);

export function TemplateFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '' as TemplateCategory | '',
    uiStyle: TemplateStyle.Modern as TemplateStyle,
    layout: TemplateLayout.Sidebar as TemplateLayout,
    tags: '',
    previewUrl: '',
    thumbnailUrl: '',
    isPremium: false,
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    setLoading(true);
    DIContainer.getInstance()
      .getTemplateById.execute(id)
      .then(t => {
        if (!t) {
          navigate('/templates');
          return;
        }
        setForm({
          name: t.name,
          description: t.description,
          category: t.category,
          uiStyle: t.uiStyle,
          layout: t.layout,
          tags: t.tags.join(', '),
          previewUrl: t.previewUrl,
          thumbnailUrl: t.thumbnailUrl,
          isPremium: t.isPremium,
          status: (t.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
        });
        setPreviewUrl(t.previewUrl);
      })
      .finally(() => setLoading(false));
  }, [id, mode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category || !form.previewUrl.trim()) {
      setError('Vui lòng điền: Tên, Danh mục và Preview URL');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const container = DIContainer.getInstance();
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      if (mode === 'create') {
        await container.createTemplate.execute({
          name: form.name,
          description: form.description,
          category: form.category as TemplateCategory,
          uiStyle: form.uiStyle,
          layout: form.layout,
          tags,
          previewUrl: form.previewUrl,
          thumbnailUrl: form.thumbnailUrl || undefined,
          isPremium: form.isPremium,
        });
      } else {
        await container.updateTemplate.execute({
          id: id!,
          name: form.name,
          description: form.description,
          category: form.category as TemplateCategory,
          uiStyle: form.uiStyle,
          layout: form.layout,
          tags,
          previewUrl: form.previewUrl,
          thumbnailUrl: form.thumbnailUrl || undefined,
          isPremium: form.isPremium,
        });
      }
      navigate('/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-base font-medium text-ink-muted animate-pulse">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="topbar flex h-[72px] flex-shrink-0 items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="btn-ghost btn-icon hidden lg:inline-flex flex-shrink-0"
            title={collapsed ? 'Mở rộng Sidebar (Ctrl+B)' : 'Thu gọn Sidebar (Ctrl+B)'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px] text-brand" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </button>
          <button className="btn-ghost btn-icon" onClick={() => navigate(-1)} title="Quay lại">
            <ArrowLeft className="h-[18px] w-[18px]" />
          </button>
          <h1 className="font-display text-lg font-bold text-ink">
            {mode === 'create' ? 'Thêm Template Mới' : 'Chỉnh sửa Template'}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreview(v => !v)}
            className="btn-ghost btn-sm"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Ẩn preview' : 'Hiện preview'}
          </button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary btn-sm">
            <Save className="h-4 w-4" />
            {saving ? 'Đang lưu...' : 'Lưu Template'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[500px] flex-shrink-0 overflow-y-auto border-r border-line bg-surface/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                <AlertCircle className="h-[18px] w-[18px] text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-rose-600">{error}</p>
              </div>
            )}

            <Field label="Tên Template *">
              <input
                className="input-glass"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="VD: VELOX — Autonomous Cloud SaaS"
              />
            </Field>

            <Field label="Mô tả">
              <textarea
                className="input-glass"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả ngắn về phong cách & tính năng của template..."
                rows={3}
              />
            </Field>

            <Field label="1. Ngành nghề (Category) *">
              <SelectGlass
                value={form.category ?? ''}
                onChange={v => setForm({ ...form, category: v as TemplateCategory })}
                options={[
                  { value: '', label: 'Chọn ngành nghề...' },
                  ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
                ]}
                placeholder="Chọn ngành nghề..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-3.5">
              <Field label="2. Phong cách (UI Style)">
                <SelectGlass
                  value={form.uiStyle}
                  onChange={v => setForm({ ...form, uiStyle: v as TemplateStyle })}
                  options={UI_STYLES.map(s => ({ value: s.value, label: s.label }))}
                />
              </Field>

              <Field label="3. Bố cục (Layout)">
                <SelectGlass
                  value={form.layout}
                  onChange={v => setForm({ ...form, layout: v as TemplateLayout })}
                  options={LAYOUTS.map(l => ({ value: l.value, label: l.label }))}
                />
              </Field>
            </div>

            <Field label="Tags" hint="Phân cách bởi dấu phẩy">
              <input
                className="input-glass"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="saas, glassmorphism, bento-grid, visual-data"
              />
            </Field>

            <Field label="Preview URL *" hint="Nhấn Tab để cập nhật khung xem trước">
              <input
                className="input-glass font-mono text-[0.84375rem]"
                value={form.previewUrl}
                onChange={e => setForm({ ...form, previewUrl: e.target.value })}
                onBlur={() => setPreviewUrl(form.previewUrl)}
                placeholder="/templates/landing-page/saas-modern/index.html"
              />
            </Field>

            <Field label="Thumbnail URL">
              <input
                className="input-glass"
                value={form.thumbnailUrl}
                onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })}
                placeholder="/thumbnails/tpl-001.svg"
              />
              {form.thumbnailUrl && (
                <div className="mt-2.5 overflow-hidden rounded-xl border border-line shadow-sm">
                  <img
                    src={form.thumbnailUrl}
                    alt="Thumbnail"
                    className="h-32 w-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </Field>

            <Field label="Trạng thái">
              <div className="flex gap-2.5">
                {(['draft', 'published'] as const).map(s => {
                  const active = form.status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, status: s })}
                      className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? s === 'published'
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700'
                            : 'border-brand/40 bg-brand/15 text-brand-strong'
                          : 'border-line bg-elevated/70 text-ink-muted hover:text-ink'
                      }`}
                    >
                      {s === 'published' ? 'Xuất bản' : 'Bản nháp'}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="flex items-center justify-between glass-subcard px-5 py-4">
              <div>
                <p className="text-sm font-bold text-ink">Template Premium</p>
                <p className="text-xs mt-0.5 text-ink-muted">Đánh dấu giao diện cao cấp</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, isPremium: !form.isPremium })}
                className={`relative h-6 w-11 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                  form.isPremium ? 'bg-brand' : 'bg-line'
                }`}
              >
                <span
                  className="absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
                  style={{ transform: form.isPremium ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
          </form>
        </div>

        {showPreview && (
          <div className="flex-1 overflow-hidden relative p-4">
            {previewUrl ? (
              <div className="h-full w-full overflow-hidden rounded-2xl border border-line shadow-lg bg-elevated">
                <iframe
                  src={previewUrl}
                  className="h-full w-full border-0"
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="glass rounded-2xl p-8 text-center">
                  <Eye className="h-11 w-11 text-brand/45 mx-auto mb-3" />
                  <p className="font-display text-base font-bold text-ink">
                    Khung xem trước trực tiếp
                  </p>
                  <p className="text-sm mt-1 text-ink-muted">
                    Nhập Preview URL và nhấn phím Tab để hiển thị
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
