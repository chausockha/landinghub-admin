import { TemplateStatus, TemplateStatusLabels } from '../../../domain/template/value-objects/TemplateStatus.ts';

interface Props { status: string; }

export function TemplateStatusBadge({ status }: Props) {
  const cls = {
    [TemplateStatus.Published]: 'badge-published',
    [TemplateStatus.Draft]:     'badge-draft',
    [TemplateStatus.Archived]:  'badge-archived',
  }[status] ?? 'badge-draft';

  return (
    <span className={cls}>
      <span className="badge-dot" />
      {TemplateStatusLabels[status as TemplateStatus] ?? status}
    </span>
  );
}
