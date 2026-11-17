import { useEffect, useState } from 'react';
import { DIContainer } from '../../container/DIContainer.ts';
import { TemplateStatus } from '../../domain/template/value-objects/TemplateStatus.ts';
import { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';

export interface DashboardStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  premium: number;
  byCategory: { category: TemplateCategory; count: number }[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = DIContainer.getInstance();
    container.listTemplates.execute().then(templates => {
      const byCategory = Object.values(TemplateCategory).map(cat => ({
        category: cat,
        count: templates.filter(t => t.category === cat).length,
      }));

      setStats({
        total: templates.length,
        published: templates.filter(t => t.status === TemplateStatus.Published).length,
        draft: templates.filter(t => t.status === TemplateStatus.Draft).length,
        archived: templates.filter(t => t.status === TemplateStatus.Archived).length,
        premium: templates.filter(t => t.isPremium).length,
        byCategory,
      });
    }).finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
