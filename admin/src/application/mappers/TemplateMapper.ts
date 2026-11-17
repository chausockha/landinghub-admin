import { Template } from '../../domain/template/entities/Template.ts';
import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import { TemplateStatus } from '../../domain/template/value-objects/TemplateStatus.ts';
import type { TemplateCategory } from '../../domain/template/value-objects/TemplateCategory.ts';
import { TemplateStyle } from '../../domain/template/value-objects/TemplateStyle.ts';
import { TemplateLayout } from '../../domain/template/value-objects/TemplateLayout.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';

export interface TemplateRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  uiStyle?: string;
  layout?: string;
  tags: string[];
  previewUrl: string;
  thumbnailUrl: string;
  status: string;
  isPremium: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export class TemplateMapper {
  static toDomain(record: TemplateRecord): Template {
    return new Template(
      TemplateId.from(record.id),
      record.name,
      record.description,
      record.category as TemplateCategory,
      record.tags,
      record.previewUrl,
      record.thumbnailUrl,
      record.status as TemplateStatus,
      record.isPremium,
      record.version,
      new Date(record.createdAt),
      new Date(record.updatedAt),
      (record.uiStyle as TemplateStyle) ?? TemplateStyle.Modern,
      (record.layout as TemplateLayout) ?? TemplateLayout.Sidebar,
    );
  }

  static toRecord(template: Template): TemplateRecord {
    return {
      id: template.id.value,
      name: template.name,
      description: template.description,
      category: template.category,
      uiStyle: template.uiStyle,
      layout: template.layout,
      tags: template.tags,
      previewUrl: template.previewUrl,
      thumbnailUrl: template.thumbnailUrl,
      status: template.status,
      isPremium: template.isPremium,
      version: template.version,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }

  static toResponseDTO(template: Template): TemplateResponseDTO {
    return {
      id: template.id.value,
      name: template.name,
      description: template.description,
      category: template.category,
      uiStyle: template.uiStyle,
      layout: template.layout,
      tags: template.tags,
      previewUrl: template.previewUrl,
      thumbnailUrl: template.thumbnailUrl,
      status: template.status,
      isPremium: template.isPremium,
      version: template.version,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }
}
