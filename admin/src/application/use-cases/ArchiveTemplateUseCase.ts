import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import type { ITemplateRepository } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';
import { TemplateMapper } from '../mappers/TemplateMapper.ts';

export class ArchiveTemplateUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(id: string): Promise<TemplateResponseDTO> {
    const template = await this.repo.findById(TemplateId.from(id));
    if (!template) throw new Error(`Template not found: ${id}`);
    template.archive();
    await this.repo.save(template);
    return TemplateMapper.toResponseDTO(template);
  }
}
