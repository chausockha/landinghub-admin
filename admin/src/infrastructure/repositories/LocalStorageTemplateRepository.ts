import { TemplateMapper, type TemplateRecord } from '../../application/mappers/TemplateMapper.ts';
import type { Template } from '../../domain/template/entities/Template.ts';
import type { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';
import type { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import type {
  ITemplateRepository,
  TemplateFilters,
} from '../../domain/template/repositories/ITemplateRepository.ts';
import { TemplateService } from '../../domain/template/services/TemplateService.ts';

export const TEMPLATES_STORAGE_KEY = 'landinghub:templates:v18';

export class LocalStorageTemplateRepository implements ITemplateRepository {
  private readonly STORAGE_KEY = TEMPLATES_STORAGE_KEY;
  private cache: Template[] | null = null;

  async findById(id: TemplateId): Promise<Template | null> {
    const all = await this.findAll();
    return all.find(t => t.id.equals(id)) ?? null;
  }

  async findAll(filters?: TemplateFilters): Promise<Template[]> {
    let templates = await this.loadAll();

    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }
    if (filters?.uiStyle) {
      templates = templates.filter(t => t.uiStyle === filters.uiStyle);
    }
    if (filters?.layout) {
      templates = templates.filter(t => t.layout === filters.layout);
    }
    if (filters?.status) {
      templates = templates.filter(t => t.status === filters.status);
    }
    if (filters?.isPremium !== undefined) {
      templates = templates.filter(t => t.isPremium === filters.isPremium);
    }
    if (filters?.tags && filters.tags.length > 0) {
      templates = templates.filter(t =>
        filters.tags!.some(tag => t.tags.includes(tag)),
      );
    }
    if (filters?.searchQuery) {
      templates = TemplateService.filterByQuery(templates, filters.searchQuery);
    }

    return templates;
  }

  async findByCategory(category: TemplateCategory): Promise<Template[]> {
    return this.findAll({ category });
  }

  async search(query: string): Promise<Template[]> {
    return this.findAll({ searchQuery: query });
  }

  async count(filters?: TemplateFilters): Promise<number> {
    const templates = await this.findAll(filters);
    return templates.length;
  }

  async save(template: Template): Promise<void> {
    const all = await this.loadAll();
    const index = all.findIndex(t => t.id.equals(template.id));
    if (index >= 0) {
      all[index] = template;
    } else {
      all.push(template);
    }
    this.persist(all);
    this.cache = all;
  }

  async delete(id: TemplateId): Promise<void> {
    const all = await this.loadAll();
    const filtered = all.filter(t => !t.id.equals(id));
    this.persist(filtered);
    this.cache = filtered;
  }

  private async loadAll(): Promise<Template[]> {
    if (this.cache) return [...this.cache];

    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      const records: TemplateRecord[] = JSON.parse(raw);
      this.cache = records.map(TemplateMapper.toDomain);
      return [...this.cache];
    }

    // Seed from JSON file on first load
    const { default: data } = (await import('../persistence/templates-seed.json')) as unknown as {
      default: { templates: TemplateRecord[] };
    };
    const templates = data.templates.map(TemplateMapper.toDomain);
    this.persist(templates);
    this.cache = templates;
    return [...templates];
  }

  private persist(templates: Template[]): void {
    const records = templates.map(TemplateMapper.toRecord);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  clearCache(): void {
    this.cache = null;
  }
}
