import type { Template } from '../entities/Template.ts';
import { TemplateStatus } from '../value-objects/TemplateStatus.ts';

export class TemplateService {
  static getStatusCounts(templates: Template[]): Record<TemplateStatus, number> {
    return {
      [TemplateStatus.Draft]: templates.filter(t => t.isDraft()).length,
      [TemplateStatus.Published]: templates.filter(t => t.isPublished()).length,
      [TemplateStatus.Archived]: templates.filter(t => t.isArchived()).length,
    };
  }

  static filterByQuery(templates: Template[], query: string): Template[] {
    const q = query.toLowerCase();
    return templates.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)),
    );
  }
}
