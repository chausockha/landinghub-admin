import type { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';
import type { TemplateStyle } from '../../domain/template/value-objects/TemplateStyle.ts';
import type { TemplateLayout } from '../../domain/template/value-objects/TemplateLayout.ts';
import type { TemplateStatus } from '../../domain/template/value-objects/TemplateStatus.ts';

export interface TemplateResponseDTO {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  uiStyle: TemplateStyle;
  layout: TemplateLayout;
  tags: string[];
  previewUrl: string;
  thumbnailUrl: string;
  status: TemplateStatus;
  isPremium: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}
