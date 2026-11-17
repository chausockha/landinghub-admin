import { Search, X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, UI_STYLES, LAYOUTS } from '../../../shared/constants/categories.ts';
import { TemplateStatus, TemplateStatusLabels } from '../../../domain/template/value-objects/TemplateStatus.ts';
import type { TemplateCategory } from '../../../domain/template/value-objects/TemplateCategory.ts';
import type { TemplateStyle } from '../../../domain/template/value-objects/TemplateStyle.ts';
import type { TemplateLayout } from '../../../domain/template/value-objects/TemplateLayout.ts';
import type { TemplateFilters as Filters } from '../../../domain/template/repositories/ITemplateRepository.ts';
import { SelectGlass } from '../ui/select-glass.tsx';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Ngành nghề: Tất cả (9)' },
  ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
];

const STYLE_OPTIONS = [
  { value: 'all', label: 'UI Style: Tất cả (8)' },
  ...UI_STYLES.map(s => ({ value: s.value, label: s.label })),
];

const LAYOUT_OPTIONS = [
  { value: 'all', label: 'Layout: Tất cả (6)' },
  ...LAYOUTS.map(l => ({ value: l.value, label: l.label })),
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Trạng thái: Tất cả' },
  ...Object.values(TemplateStatus).map(s => ({ value: s, label: TemplateStatusLabels[s] })),
];

export function TemplateFilters({ filters, onChange }: Props) {
  const hasFilters = !!(
    filters.category ||
    filters.uiStyle ||
    filters.layout ||
    filters.status ||
    filters.searchQuery ||
    filters.isPremium !== undefined
  );

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-ink-muted" />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-ink-muted" />
        <input
          className="input-glass pl-10 w-56"
          placeholder="Tìm tên, tag, ngành..."
          value={filters.searchQuery ?? ''}
          onChange={e => onChange({ ...filters, searchQuery: e.target.value || undefined })}
        />
      </div>

      {/* 1. Category – Ngành nghề */}
      <SelectGlass
        className="w-52"
        value={filters.category ?? 'all'}
        options={CATEGORY_OPTIONS}
        onChange={v =>
          onChange({ ...filters, category: v === 'all' ? undefined : (v as TemplateCategory) })
        }
      />

      {/* 2. UI Style – Phong cách */}
      <SelectGlass
        className="w-48"
        value={filters.uiStyle ?? 'all'}
        options={STYLE_OPTIONS}
        onChange={v =>
          onChange({ ...filters, uiStyle: v === 'all' ? undefined : (v as TemplateStyle) })
        }
      />

      {/* 3. Layout – Bố cục */}
      <SelectGlass
        className="w-48"
        value={filters.layout ?? 'all'}
        options={LAYOUT_OPTIONS}
        onChange={v =>
          onChange({ ...filters, layout: v === 'all' ? undefined : (v as TemplateLayout) })
        }
      />

      {/* Status */}
      <SelectGlass
        className="w-44"
        value={filters.status ?? 'all'}
        options={STATUS_OPTIONS}
        onChange={v =>
          onChange({ ...filters, status: v === 'all' ? undefined : (v as TemplateStatus) })
        }
      />

      {hasFilters && (
        <button
          onClick={() => onChange({})}
          className="btn-danger btn-sm"
          style={{ minHeight: '2.625rem' }}
        >
          <X className="h-4 w-4" />
          Xóa lọc
        </button>
      )}
    </div>
  );
}
