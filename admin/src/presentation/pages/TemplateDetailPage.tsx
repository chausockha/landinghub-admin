import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Globe, Trash2,
  Tag, CalendarDays, Hash, Info, ExternalLink,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useTemplate } from '../hooks/useTemplate.ts';
import { useSidebar } from '../components/layout/SidebarContext.tsx';
import { DIContainer } from '../../container/DIContainer.ts';
import { TemplateStatusBadge } from '../components/template/TemplateStatusBadge.tsx';
import { TemplateStatus } from '../../domain/template/value-objects/TemplateStatus.ts';
import { TemplateCategoryLabels } from '../../domain/template/value-objects/TemplateCategory.ts';
import { TemplateStyleLabels } from '../../domain/template/value-objects/TemplateStyle.ts';
import { TemplateLayoutLabels } from '../../domain/template/value-objects/TemplateLayout.ts';
import { formatDateTime } from '../../shared/utils/date-formatter.ts';

export function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { template, loading, error } = useTemplate(id);
  const { collapsed, toggleCollapsed } = useSidebar();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-base font-medium text-ink-muted animate-pulse">Đang tải...</p>
      </div>
    );
  }
  if (error || !template) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <Info className="h-9 w-9 text-ink-muted mx-auto mb-3" />
          <p className="text-base font-medium text-ink-secondary mb-4">Không tìm thấy template</p>
          <button className="btn-ghost btn-sm" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isPublished = template.status === TemplateStatus.Published;

  const handlePublish = async () => {
    await DIContainer.getInstance().publishTemplate.execute(template.id, !isPublished);
    navigate('/templates');
  };
  const handleDelete = async () => {
    if (window.confirm(`Xoá template "${template.name}"?`)) {
      await DIContainer.getInstance().deleteTemplate.execute(template.id);
      navigate('/templates');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="topbar flex h-[72px] flex-shrink-0 items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
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
          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold text-ink leading-tight truncate">
              {template.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <TemplateStatusBadge status={template.status} />
              {template.isPremium && <span className="badge-premium">Premium</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {template.previewUrl && (
            <button
              className="preview-open-btn"
              onClick={() => window.open(template.previewUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4" />
              Mở trong tab mới
            </button>
          )}
          <button className="btn-ghost btn-sm" onClick={() => navigate(`/templates/${id}/edit`)}>
            <Pencil className="h-4 w-4" /> Chỉnh sửa
          </button>
          <button
            className={isPublished ? 'btn-success btn-sm' : 'btn-primary btn-sm'}
            onClick={handlePublish}
          >
            <Globe className="h-4 w-4" />
            {isPublished ? 'Bỏ xuất bản' : 'Xuất bản'}
          </button>
          <div className="h-5 w-px bg-line mx-1" />
          <button className="btn-danger btn-sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Xoá
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden relative p-4">
          <div className="h-full w-full overflow-hidden rounded-2xl border border-line shadow-lg bg-elevated">
            <iframe
              src={template.previewUrl}
              className="h-full w-full border-0"
              title={`Preview: ${template.name}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        <div className="w-80 flex-shrink-0 overflow-y-auto border-l border-line bg-surface/80 backdrop-blur-xl">
          <div className="p-5 space-y-5">
            {[
              {
                icon: Info,
                label: 'Mô tả',
                content: (
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    {template.description || '(Chưa có mô tả)'}
                  </p>
                ),
              },
              {
                icon: Hash,
                label: 'Phân loại 3 Chiều',
                content: (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="chip-brand">
                      {TemplateCategoryLabels[template.category as keyof typeof TemplateCategoryLabels]}
                    </span>
                    <span className="chip">
                      {TemplateStyleLabels[template.uiStyle as keyof typeof TemplateStyleLabels] ??
                        template.uiStyle}
                    </span>
                    <span className="chip">
                      {TemplateLayoutLabels[template.layout as keyof typeof TemplateLayoutLabels] ??
                        template.layout}
                    </span>
                  </div>
                ),
              },
              {
                icon: Tag,
                label: 'Tags',
                content: (
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map(t => (
                      <span key={t} className="chip">
                        #{t}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                icon: CalendarDays,
                label: 'Thời gian',
                content: (
                  <div className="space-y-2.5 glass-subcard p-3.5">
                    {[
                      { l: 'Phiên bản', v: template.version },
                      { l: 'Ngày tạo', v: formatDateTime(template.createdAt) },
                      { l: 'Cập nhật', v: formatDateTime(template.updatedAt) },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex items-center justify-between gap-2">
                        <span className="label-xs">{l}</span>
                        <span className="text-xs font-mono font-semibold text-ink-secondary text-right">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                icon: ExternalLink,
                label: 'Preview URL',
                content: (
                  <code className="block rounded-xl border border-brand/25 bg-brand/[0.06] px-3.5 py-2.5 text-xs break-all font-mono text-brand-strong">
                    {template.previewUrl}
                  </code>
                ),
              },
            ].map(({ icon: Icon, label, content }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-brand" />
                  <span className="label-xs">{label}</span>
                </div>
                {content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
