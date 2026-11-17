export enum TemplateLayout {
  Sidebar = 'sidebar',
  Topbar = 'topbar',
  BentoGrid = 'bento-grid',
  SplitPanel = 'split-panel',
  FullWidth = 'full-width',
  MultiPanel = 'multi-panel',
}

export const TemplateLayoutLabels: Record<TemplateLayout, string> = {
  [TemplateLayout.Sidebar]: 'Sidebar',
  [TemplateLayout.Topbar]: 'Topbar',
  [TemplateLayout.BentoGrid]: 'Bento Grid',
  [TemplateLayout.SplitPanel]: 'Split Panel',
  [TemplateLayout.FullWidth]: 'Full Width',
  [TemplateLayout.MultiPanel]: 'Multi Panel',
};
