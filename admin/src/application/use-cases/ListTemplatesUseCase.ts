import type { ITemplateRepository, TemplateFilters } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';
import { TemplateMapper } from '../mappers/TemplateMapper.ts';

export class ListTemplatesUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(filters?: TemplateFilters): Promise<TemplateResponseDTO[]> {
    const templates = await this.repo.findAll(filters);
    return templates.map(TemplateMapper.toResponseDTO);
  }
}
