import type { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';
import type { TemplateStyle } from '../../domain/template/value-objects/TemplateStyle.ts';
import type { TemplateLayout } from '../../domain/template/value-objects/TemplateLayout.ts';

export interface CreateTemplateDTO {
  name: string;
  description: string;
  category: TemplateCategory;
  uiStyle?: TemplateStyle;
  layout?: TemplateLayout;
  tags: string[];
  previewUrl: string;
  thumbnailUrl?: string;
  isPremium?: boolean;
}
