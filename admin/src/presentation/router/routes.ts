export const ADMIN_ROUTES = {
  DASHBOARD: '/',
  TEMPLATES: '/templates',
  TEMPLATE_CREATE: '/templates/new',
  TEMPLATE_DETAIL: (id = ':id') => `/templates/${id}`,
  TEMPLATE_EDIT: (id = ':id') => `/templates/${id}/edit`,
  ROUTES_MANAGER: '/routes',
  ENTERTAINMENT: '/entertainment',
  SETTINGS: '/settings',
} as const;

export interface AdminRouteMeta {
  path: string;
  name: string;
  description: string;
  method: 'GET';
  dynamic?: boolean;
  samplePath?: string;
}

export const ADMIN_ROUTE_MANIFEST: AdminRouteMeta[] = [
  {
    path: '/',
    name: 'Dashboard Overview',
    description: 'Tổng quan KPI, phân bố danh mục và thao tác nhanh',
    method: 'GET',
  },
  {
    path: '/templates',
    name: 'Template Catalog',
    description: 'Danh sách tất cả templates, hỗ trợ query ?category= & ?status=',
    method: 'GET',
  },
  {
    path: '/templates/new',
    name: 'Create Template',
    description: 'Biểu mẫu khởi tạo template mới kèm live iframe preview',
    method: 'GET',
  },
  {
    path: '/templates/:id',
    name: 'Template Detail & Preview',
    description: 'Chi tiết metadata và khung xem trước trực tiếp của từng template',
    method: 'GET',
    dynamic: true,
    samplePath: '/templates/tpl-001',
  },
  {
    path: '/templates/:id/edit',
    name: 'Edit Template',
    description: 'Cập nhật thông tin, trạng thái xuất bản và URL của template',
    method: 'GET',
    dynamic: true,
    samplePath: '/templates/tpl-001/edit',
  },
  {
    path: '/routes',
    name: 'Routes & Live Endpoints',
    description: 'Quản lý định tuyến Web Admin & kiểm tra trạng thái HTTP của Template URLs',
    method: 'GET',
  },
  {
    path: '/entertainment',
    name: 'Entertainment Zone · 3D Relax Hub',
    description: 'Kệ giải trí tương tác 3D (Zen Koi Pond 3D & Meow 3D) tích hợp trực tiếp trong Admin',
    method: 'GET',
  },
  {
    path: '/settings',
    name: 'System Settings',
    description: 'Quản lý dữ liệu LocalStorage, khôi phục seed và cấu hình hệ thống',
    method: 'GET',
  },
];
