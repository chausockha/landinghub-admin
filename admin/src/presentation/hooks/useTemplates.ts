import { useCallback, useEffect, useState } from 'react';
import { DIContainer } from '../../container/DIContainer.ts';
import type { TemplateResponseDTO } from '../../application/dto/TemplateResponseDTO.ts';
import type { TemplateFilters } from '../../domain/template/repositories/ITemplateRepository.ts';

export function useTemplates(filters?: TemplateFilters) {
  const [templates, setTemplates] = useState<TemplateResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const container = DIContainer.getInstance();
      const data = await container.listTemplates.execute(filters);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  const deleteTemplate = useCallback(async (id: string) => {
    const container = DIContainer.getInstance();
    await container.deleteTemplate.execute(id);
    await load();
  }, [load]);

  const publishTemplate = useCallback(async (id: string, publish: boolean) => {
    const container = DIContainer.getInstance();
    await container.publishTemplate.execute(id, publish);
    await load();
  }, [load]);

  const archiveTemplate = useCallback(async (id: string) => {
    const container = DIContainer.getInstance();
    await container.archiveTemplate.execute(id);
    await load();
  }, [load]);

  return { templates, loading, error, refetch: load, deleteTemplate, publishTemplate, archiveTemplate };
}
