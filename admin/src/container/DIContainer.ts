import {
  LocalStorageTemplateRepository,
  TEMPLATES_STORAGE_KEY,
} from '../infrastructure/repositories/LocalStorageTemplateRepository.ts';
import { CreateTemplateUseCase } from '../application/use-cases/CreateTemplateUseCase.ts';
import { UpdateTemplateUseCase } from '../application/use-cases/UpdateTemplateUseCase.ts';
import { DeleteTemplateUseCase } from '../application/use-cases/DeleteTemplateUseCase.ts';
import { GetTemplateByIdUseCase } from '../application/use-cases/GetTemplateByIdUseCase.ts';
import { ListTemplatesUseCase } from '../application/use-cases/ListTemplatesUseCase.ts';
import { PublishTemplateUseCase } from '../application/use-cases/PublishTemplateUseCase.ts';
import { ArchiveTemplateUseCase } from '../application/use-cases/ArchiveTemplateUseCase.ts';

export class DIContainer {
  private static instance: DIContainer;
  private readonly templateRepo: LocalStorageTemplateRepository;

  private constructor() {
    this.templateRepo = new LocalStorageTemplateRepository();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  get createTemplate(): CreateTemplateUseCase {
    return new CreateTemplateUseCase(this.templateRepo);
  }

  get updateTemplate(): UpdateTemplateUseCase {
    return new UpdateTemplateUseCase(this.templateRepo);
  }

  get deleteTemplate(): DeleteTemplateUseCase {
    return new DeleteTemplateUseCase(this.templateRepo);
  }

  get getTemplateById(): GetTemplateByIdUseCase {
    return new GetTemplateByIdUseCase(this.templateRepo);
  }

  get listTemplates(): ListTemplatesUseCase {
    return new ListTemplatesUseCase(this.templateRepo);
  }

  get publishTemplate(): PublishTemplateUseCase {
    return new PublishTemplateUseCase(this.templateRepo);
  }

  get archiveTemplate(): ArchiveTemplateUseCase {
    return new ArchiveTemplateUseCase(this.templateRepo);
  }

  resetStorage(): void {
    localStorage.removeItem('landinghub:templates:v1');
    localStorage.removeItem('landinghub:templates:v2');
    localStorage.removeItem('landinghub:templates:v3');
    localStorage.removeItem('landinghub:templates:v4');
    localStorage.removeItem('landinghub:templates:v5');
    localStorage.removeItem('landinghub:templates:v6');
    localStorage.removeItem('landinghub:templates:v7');
    localStorage.removeItem('landinghub:templates:v8');
    localStorage.removeItem('landinghub:templates:v9');
    localStorage.removeItem('landinghub:templates:v10');
    localStorage.removeItem('landinghub:templates:v11');
    localStorage.removeItem('landinghub:templates:v12');
    localStorage.removeItem('landinghub:templates:v13');
    localStorage.removeItem('landinghub:templates:v14');
    localStorage.removeItem('landinghub:templates:v15');
    localStorage.removeItem('landinghub:templates:v16');
    localStorage.removeItem('landinghub:templates:v17');
    localStorage.removeItem('landinghub:templates:v18');
    localStorage.removeItem('landinghub:templates:v19');
    localStorage.removeItem(TEMPLATES_STORAGE_KEY);
    this.templateRepo.clearCache();
  }
}
