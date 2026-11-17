import { Template } from '../../domain/template/entities/Template.ts';
import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import { TemplateStatus } from '../../domain/template/value-objects/TemplateStatus.ts';
import { TemplateStyle } from '../../domain/template/value-objects/TemplateStyle.ts';
import { TemplateLayout } from '../../domain/template/value-objects/TemplateLayout.ts';
import type { ITemplateRepository } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { CreateTemplateDTO } from '../dto/CreateTemplateDTO.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';
import { TemplateMapper } from '../mappers/TemplateMapper.ts';

export class CreateTemplateUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(dto: CreateTemplateDTO): Promise<TemplateResponseDTO> {
    if (!dto.name?.trim()) throw new Error('Template name is required');
    if (!dto.category) throw new Error('Template category is required');
    if (!dto.previewUrl?.trim()) throw new Error('Preview URL is required');

    const template = new Template(
      TemplateId.create(),
      dto.name.trim(),
      dto.description?.trim() ?? '',
      dto.category,
      dto.tags ?? [],
      dto.previewUrl.trim(),
      dto.thumbnailUrl ?? `https://placehold.co/800x450/1a1a2e/ffffff?text=${encodeURIComponent(dto.name)}`,
      TemplateStatus.Draft,
      dto.isPremium ?? false,
      '1.0.0',
      new Date(),
      new Date(),
      dto.uiStyle ?? TemplateStyle.Modern,
      dto.layout ?? TemplateLayout.Sidebar,
    );

    await this.repo.save(template);
    return TemplateMapper.toResponseDTO(template);
  }
}
