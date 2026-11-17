import type { Category } from '../entities/Category.ts';
import type { TemplateCategory } from '../../template/value-objects/TemplateCategory.ts';

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: TemplateCategory): Promise<Category | null>;
  updateCount(id: TemplateCategory, count: number): Promise<void>;
}
