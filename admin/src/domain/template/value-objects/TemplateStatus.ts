export enum TemplateStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export const TemplateStatusLabels: Record<TemplateStatus, string> = {
  [TemplateStatus.Draft]: 'Nháp',
  [TemplateStatus.Published]: 'Đã xuất bản',
  [TemplateStatus.Archived]: 'Đã lưu trữ',
};
