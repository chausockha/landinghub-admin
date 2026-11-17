export enum TemplateCategory {
  SaaS = 'saas',
  Finance = 'finance',
  Ecommerce = 'e-commerce',
  Business = 'business',
  Healthcare = 'healthcare',
  Education = 'education',
  Technology = 'technology',
  Logistics = 'logistics',
  ESG = 'esg',
}

export const TemplateCategoryLabels: Record<TemplateCategory, string> = {
  [TemplateCategory.SaaS]: 'SaaS',
  [TemplateCategory.Finance]: 'Finance',
  [TemplateCategory.Ecommerce]: 'E-commerce',
  [TemplateCategory.Business]: 'Business',
  [TemplateCategory.Healthcare]: 'Healthcare',
  [TemplateCategory.Education]: 'Education',
  [TemplateCategory.Technology]: 'Technology',
  [TemplateCategory.Logistics]: 'Logistics',
  [TemplateCategory.ESG]: 'ESG',
};
