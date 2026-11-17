import {
  Eye,
  Pencil,
  Trash2,
  Globe,
  Crown,
  CalendarDays,
  ExternalLink,
  Sparkles,
  PanelTop,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TemplateResponseDTO } from '../../../application/dto/TemplateResponseDTO.ts';
import { TemplateStatus } from '../../../domain/template/value-objects/TemplateStatus.ts';
import { TemplateCategoryLabels } from '../../../domain/template/value-objects/TemplateCategory.ts';
import { TemplateStyleLabels } from '../../../domain/template/value-objects/TemplateStyle.ts';
import { TemplateLayoutLabels } from '../../../domain/template/value-objects/TemplateLayout.ts';
import { TemplateStatusBadge } from './TemplateStatusBadge.tsx';
import { formatDate } from '../../../shared/utils/date-formatter.ts';

interface Props {
  template: TemplateResponseDTO;
  onDelete: (id: string) => void;
  onPublish: (id: string, publish: boolean) => void;
  onArchive: (id: string) => void;
}

export function TemplateCard({ template, onDelete, onPublish }: Props) {
  const navigate = useNavigate();
  const isPublished = template.status === TemplateStatus.Published;

  const categoryLabel =
    TemplateCategoryLabels[template.category as keyof typeof TemplateCategoryLabels] ??
    template.category;
  const styleLabel =
    TemplateStyleLabels[template.uiStyle as keyof typeof TemplateStyleLabels] ??
    template.uiStyle;
  const layoutLabel =
    TemplateLayoutLabels[template.layout as keyof typeof TemplateLayoutLabels] ??
    template.layout;

  return (
    <div className="template-card group flex flex-col">
      {/* Thumbnail */}
      <div
        onClick={() => navigate(`/templates/${template.id}`)}
        className="relative aspect-video overflow-hidden bg-canvas border-b border-line cursor-pointer"
      >
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={e => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/800x450/F1F5F9/0F172A?text=${encodeURIComponent(template.name)}`;
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top overlay badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <TemplateStatusBadge status={template.status} />
          {template.isPremium && (
            <span className="badge-premium flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>

        {/* Hover action strip */}
        <div
          onClick={e => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-2.5
                     opacity-0 translate-y-2 pointer-events-none transition-all duration-200
                     group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
        >
          <button
            onClick={() => navigate(`/templates/${template.id}`)}
            className="inline-flex min-h-[34px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-elevated/95 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-md hover:border-brand/45 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            Chi tiết
          </button>
          {template.previewUrl && (
            <button
              onClick={() => window.open(template.previewUrl, '_blank', 'noopener,noreferrer')}
              className="inline-flex min-h-[34px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-brand-fg shadow-md hover:bg-brand-strong cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Mở trang
            </button>
          )}
          <button
            onClick={() => navigate(`/templates/${template.id}/edit`)}
            className="inline-flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg border border-line bg-elevated/95 text-ink shadow-md hover:border-brand/45 cursor-pointer"
            title="Chỉnh sửa"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <h3
          onClick={() => navigate(`/templates/${template.id}`)}
          className="font-display text-[1.0625rem] font-bold leading-snug line-clamp-1 text-ink hover:text-brand transition-colors cursor-pointer"
        >
          {template.name}
        </h3>

        <p className="text-sm line-clamp-2 leading-relaxed text-ink-secondary">
          {template.description || 'Chưa có mô tả.'}
        </p>

        {/* 3-Axis Taxonomy Badges: Category · UI Style · Layout */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            onClick={() => navigate(`/templates?category=${template.category}`)}
            className="chip-brand cursor-pointer hover:opacity-85"
            title="Lọc theo ngành nghề"
          >
            {categoryLabel}
          </span>
          <span
            onClick={() => navigate(`/templates?style=${template.uiStyle}`)}
            className="chip cursor-pointer hover:border-brand/40"
            title="Lọc theo UI Style"
          >
            <Sparkles className="h-3 w-3 text-brand" />
            {styleLabel}
          </span>
          <span
            onClick={() => navigate(`/templates?layout=${template.layout}`)}
            className="chip cursor-pointer hover:border-brand/40"
            title="Lọc theo Layout bố cục"
          >
            <PanelTop className="h-3 w-3 text-ink-muted" />
            {layoutLabel}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3.5 border-t border-line">
          <div className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-muted">
            <CalendarDays className="h-4 w-4" />
            {formatDate(template.updatedAt)}
          </div>

          <div className="flex items-center gap-1.5">
            {template.previewUrl && (
              <button
                title="Mở trang trực tiếp (Tab mới)"
                onClick={() => window.open(template.previewUrl, '_blank', 'noopener,noreferrer')}
                className="btn-ghost btn-icon text-brand hover:border-brand/45"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            {template.status !== TemplateStatus.Archived && (
              <button
                title={isPublished ? 'Bỏ xuất bản' : 'Xuất bản'}
                onClick={() => onPublish(template.id, !isPublished)}
                className={isPublished ? 'btn-success btn-icon' : 'btn-ghost btn-icon'}
              >
                <Globe className="h-4 w-4" />
              </button>
            )}
            <button
              title="Xoá"
              onClick={() => {
                if (window.confirm(`Xoá "${template.name}"?`)) onDelete(template.id);
              }}
              className="btn-danger btn-icon"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
