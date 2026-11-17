import {
  TemplateCategory,
  TemplateCategoryLabels,
} from '../../domain/template/value-objects/TemplateCategory.ts';
import {
  TemplateStyle,
  TemplateStyleLabels,
} from '../../domain/template/value-objects/TemplateStyle.ts';
import {
  TemplateLayout,
  TemplateLayoutLabels,
} from '../../domain/template/value-objects/TemplateLayout.ts';

export const CATEGORIES = Object.values(TemplateCategory).map(value => ({
  value,
  label: TemplateCategoryLabels[value],
}));

export const UI_STYLES = Object.values(TemplateStyle).map(value => ({
  value,
  label: TemplateStyleLabels[value],
}));

export const LAYOUTS = Object.values(TemplateLayout).map(value => ({
  value,
  label: TemplateLayoutLabels[value],
}));
