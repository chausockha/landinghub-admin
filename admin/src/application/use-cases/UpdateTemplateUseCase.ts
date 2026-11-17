import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import type { ITemplateRepository } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { UpdateTemplateDTO } from '../dto/UpdateTemplateDTO.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';
import { TemplateMapper } from '../mappers/TemplateMapper.ts';

export class UpdateTemplateUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(dto: UpdateTemplateDTO): Promise<TemplateResponseDTO> {
    const id = TemplateId.from(dto.id);
    const template = await this.repo.findById(id);
    if (!template) throw new Error(`Template not found: ${dto.id}`);

    template.update({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      uiStyle: dto.uiStyle,
      layout: dto.layout,
      tags: dto.tags,
      previewUrl: dto.previewUrl,
      thumbnailUrl: dto.thumbnailUrl,
      isPremium: dto.isPremium,
    });

    await this.repo.save(template);
    return TemplateMapper.toResponseDTO(template);
  }
}
