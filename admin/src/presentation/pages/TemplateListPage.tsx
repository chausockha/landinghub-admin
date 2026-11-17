import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Package } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates.ts';
import { TemplateCard } from '../components/template/TemplateCard.tsx';
import { TemplateFilters } from '../components/template/TemplateFilters.tsx';
import { Header } from '../components/layout/Header.tsx';
import { LAYOUTS, UI_STYLES } from '../../shared/constants/categories.ts';
import type { TemplateFilters as Filters } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';
import type { TemplateStyle } from '../../domain/template/value-objects/TemplateStyle.ts';
import type { TemplateLayout } from '../../domain/template/value-objects/TemplateLayout.ts';
import type { TemplateStatus } from '../../domain/template/value-objects/TemplateStatus.ts';

export function TemplateListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    category: (searchParams.get('category') as TemplateCategory) || undefined,
    uiStyle: (searchParams.get('style') as TemplateStyle) || undefined,
    layout: (searchParams.get('layout') as TemplateLayout) || undefined,
    status: (searchParams.get('status') as TemplateStatus) || undefined,
    searchQuery: searchParams.get('q') || undefined,
  });

  useEffect(() => {
    const nextCategory = (searchParams.get('category') as TemplateCategory) || undefined;
    const nextStyle = (searchParams.get('style') as TemplateStyle) || undefined;
    const nextLayout = (searchParams.get('layout') as TemplateLayout) || undefined;
    const nextStatus = (searchParams.get('status') as TemplateStatus) || undefined;
    const nextQuery = searchParams.get('q') || undefined;
    setFilters(prev => {
      if (
        prev.category === nextCategory &&
        prev.uiStyle === nextStyle &&
        prev.layout === nextLayout &&
        prev.status === nextStatus &&
        prev.searchQuery === nextQuery
      ) {
        return prev;
      }
      return {
        ...prev,
        category: nextCategory,
        uiStyle: nextStyle,
        layout: nextLayout,
        status: nextStatus,
        searchQuery: nextQuery,
      };
    });
  }, [searchParams]);

  const handleFiltersChange = (next: Filters) => {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.category) params.set('category', next.category);
    if (next.uiStyle) params.set('style', next.uiStyle);
    if (next.layout) params.set('layout', next.layout);
    if (next.status) params.set('status', next.status);
    if (next.searchQuery) params.set('q', next.searchQuery);
    setSearchParams(params, { replace: true });
  };

  const { templates, loading, error, deleteTemplate, publishTemplate, archiveTemplate } =
    useTemplates(filters);

  return (
    <div className="min-h-full">
      <Header
        title="Templates Matrix Catalog"
        subtitle={
          loading
            ? 'Đang tải...'
            : `${templates.length} giao diện · Lọc đa chiều theo 9 Ngành nghề × 8 UI Styles × 6 Layouts`
        }
      />

      <div className="p-6 lg:p-7 space-y-5">
        <div className="glass rounded-2xl px-5 py-4 space-y-3.5">
          <div className="flex items-center gap-3 flex-wrap">
            <TemplateFilters filters={filters} onChange={handleFiltersChange} />
            <div className="ml-auto flex items-center gap-1 p-1 rounded-xl border border-line bg-elevated/80">
              {(['grid', 'list'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all cursor-pointer ${
                    viewMode === m
                      ? 'bg-brand/15 border border-brand/35 text-brand-strong shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  title={m === 'grid' ? 'Chế độ lưới' : 'Chế độ danh sách'}
                >
                  {m === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Pill Strip for Layout & UI Style exploration */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line">
            <span className="label-xs mr-1">Bố cục nhanh:</span>
            {LAYOUTS.map(l => {
              const active = filters.layout === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  onClick={() =>
                    handleFiltersChange({
                      ...filters,
                      layout: active ? undefined : l.value,
                    })
                  }
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer border ${
                    active
                      ? 'border-brand bg-brand text-brand-fg shadow-sm'
                      : 'border-line bg-elevated/75 text-ink-secondary hover:text-ink'
                  }`}
                >
                  {l.label}
                </button>
              );
            })}

            <span className="h-4 w-px bg-line mx-1.5 hidden sm:inline-block" />

            <span className="label-xs mr-1">Style:</span>
            {UI_STYLES.map(s => {
              const active = filters.uiStyle === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() =>
                    handleFiltersChange({
                      ...filters,
                      uiStyle: active ? undefined : s.value,
                    })
                  }
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer border ${
                    active
                      ? 'border-brand bg-brand text-brand-fg shadow-sm'
                      : 'border-line bg-elevated/75 text-ink-secondary hover:text-ink'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="glass rounded-xl border border-rose-500/30 p-4 text-sm text-rose-600 font-medium">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="template-card">
                <div className="aspect-video skeleton" />
                <div className="p-4 space-y-2.5">
                  <div className="skeleton h-4 w-3/4 rounded-lg" />
                  <div className="skeleton h-3 w-full rounded-lg" />
                  <div className="skeleton h-3 w-1/2 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && templates.length === 0 && (
          <div className="glass flex h-64 flex-col items-center justify-center gap-3 rounded-2xl">
            <Package className="h-10 w-10 text-ink-muted/40" />
            <p className="text-sm font-medium text-ink-secondary">
              Không tìm thấy template nào khớp tổ hợp lọc hiện tại
            </p>
            <button onClick={() => handleFiltersChange({})} className="btn-ghost btn-sm">
              Xóa toàn bộ bộ lọc
            </button>
          </div>
        )}

        {!loading && templates.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col gap-3.5'
            }
          >
            {templates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onDelete={deleteTemplate}
                onPublish={publishTemplate}
                onArchive={archiveTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
