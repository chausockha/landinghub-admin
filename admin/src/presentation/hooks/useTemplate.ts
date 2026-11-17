import { useEffect, useState } from 'react';
import { DIContainer } from '../../container/DIContainer.ts';
import type { TemplateResponseDTO } from '../../application/dto/TemplateResponseDTO.ts';

export function useTemplate(id: string | undefined) {
  const [template, setTemplate] = useState<TemplateResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    DIContainer.getInstance().getTemplateById.execute(id)
      .then(setTemplate)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { template, loading, error };
}
