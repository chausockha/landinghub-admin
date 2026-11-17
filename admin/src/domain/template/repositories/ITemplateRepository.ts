import type { Template } from '../entities/Template.ts';
import type { TemplateId } from '../value-objects/TemplateId.ts';
import type { TemplateCategory } from '../value-objects/TemplateCategory.ts';
import type { TemplateStyle } from '../value-objects/TemplateStyle.ts';
import type { TemplateLayout } from '../value-objects/TemplateLayout.ts';
import type { TemplateStatus } from '../value-objects/TemplateStatus.ts';

export interface TemplateFilters {
  category?: TemplateCategory;
  uiStyle?: TemplateStyle;
  layout?: TemplateLayout;
  status?: TemplateStatus;
  tags?: string[];
  searchQuery?: string;
  isPremium?: boolean;
}

export interface ITemplateReadRepository {
  findById(id: TemplateId): Promise<Template | null>;
  findAll(filters?: TemplateFilters): Promise<Template[]>;
  findByCategory(category: TemplateCategory): Promise<Template[]>;
  search(query: string): Promise<Template[]>;
  count(filters?: TemplateFilters): Promise<number>;
}

export interface ITemplateWriteRepository {
  save(template: Template): Promise<void>;
  delete(id: TemplateId): Promise<void>;
}

export interface ITemplateRepository
  extends ITemplateReadRepository,
    ITemplateWriteRepository {}
