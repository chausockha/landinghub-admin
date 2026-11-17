import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import type { ITemplateRepository } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';
import { TemplateMapper } from '../mappers/TemplateMapper.ts';

export class GetTemplateByIdUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(id: string): Promise<TemplateResponseDTO | null> {
    const template = await this.repo.findById(TemplateId.from(id));
    if (!template) return null;
    return TemplateMapper.toResponseDTO(template);
  }
}
