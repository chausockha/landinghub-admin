import type { TemplateId } from '../value-objects/TemplateId.ts';
import { TemplateStatus } from '../value-objects/TemplateStatus.ts';
import type { TemplateCategory } from '../value-objects/TemplateCategory.ts';
import { TemplateStyle } from '../value-objects/TemplateStyle.ts';
import { TemplateLayout } from '../value-objects/TemplateLayout.ts';

export class Template {
  constructor(
    public readonly id: TemplateId,
    public name: string,
    public description: string,
    public category: TemplateCategory,
    public tags: string[],
    public previewUrl: string,
    public thumbnailUrl: string,
    public status: TemplateStatus,
    public isPremium: boolean,
    public version: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public uiStyle: TemplateStyle = TemplateStyle.Modern,
    public layout: TemplateLayout = TemplateLayout.Sidebar,
  ) {}

  publish(): void {
    if (this.status === TemplateStatus.Archived) {
      throw new Error('Cannot publish an archived template');
    }
    this.status = TemplateStatus.Published;
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.status = TemplateStatus.Draft;
    this.updatedAt = new Date();
  }

  archive(): void {
    this.status = TemplateStatus.Archived;
    this.updatedAt = new Date();
  }

  update(fields: {
    name?: string;
    description?: string;
    category?: TemplateCategory;
    uiStyle?: TemplateStyle;
    layout?: TemplateLayout;
    tags?: string[];
    previewUrl?: string;
    thumbnailUrl?: string;
    isPremium?: boolean;
  }): void {
    if (fields.name !== undefined) this.name = fields.name;
    if (fields.description !== undefined) this.description = fields.description;
    if (fields.category !== undefined) this.category = fields.category;
    if (fields.uiStyle !== undefined) this.uiStyle = fields.uiStyle;
    if (fields.layout !== undefined) this.layout = fields.layout;
    if (fields.tags !== undefined) this.tags = fields.tags;
    if (fields.previewUrl !== undefined) this.previewUrl = fields.previewUrl;
    if (fields.thumbnailUrl !== undefined) this.thumbnailUrl = fields.thumbnailUrl;
    if (fields.isPremium !== undefined) this.isPremium = fields.isPremium;
    this.updatedAt = new Date();
  }

  isPublished(): boolean {
    return this.status === TemplateStatus.Published;
  }

  isDraft(): boolean {
    return this.status === TemplateStatus.Draft;
  }

  isArchived(): boolean {
    return this.status === TemplateStatus.Archived;
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag.toLowerCase());
  }
}
