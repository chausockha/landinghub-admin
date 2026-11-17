import { TemplateId } from '../../domain/template/value-objects/TemplateId.ts';
import type { ITemplateRepository } from '../../domain/template/repositories/ITemplateRepository.ts';

export class DeleteTemplateUseCase {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(id: string): Promise<void> {
    const templateId = TemplateId.from(id);
    const template = await this.repo.findById(templateId);
    if (!template) throw new Error(`Template not found: ${id}`);
    await this.repo.delete(templateId);
  }
}
