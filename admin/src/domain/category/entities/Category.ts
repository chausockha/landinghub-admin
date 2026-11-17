import type { TemplateCategory } from '../../template/value-objects/TemplateCategory.ts';

export class Category {
  constructor(
    public readonly id: TemplateCategory,
    public readonly label: string,
    public readonly icon: string,
    public templateCount: number = 0,
  ) {}
}
