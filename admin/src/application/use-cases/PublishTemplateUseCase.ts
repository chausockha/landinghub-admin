import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import type { ITemplateRepository } from '../../domain/template/repositories/ITemplateRepository.ts';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO.ts';
import { TemplateMapper } from '../mappers/TemplateMapper.ts';

export class PublishTemplateUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(id: string, publish: boolean): Promise<TemplateResponseDTO> {
    const template = await this.repo.findById(TemplateId.from(id));
    if (!template) throw new Error(`Template not found: ${id}`);

    if (publish) template.publish();
    else template.unpublish();

    await this.repo.save(template);
    return TemplateMapper.toResponseDTO(template);
  }
}
