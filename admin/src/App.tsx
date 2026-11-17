import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './presentation/theme/ThemeProvider.tsx';
import { AppLayout } from './presentation/components/layout/AppLayout.tsx';
import { DashboardPage } from './presentation/pages/DashboardPage.tsx';
import { TemplateListPage } from './presentation/pages/TemplateListPage.tsx';
import { TemplateDetailPage } from './presentation/pages/TemplateDetailPage.tsx';
import { TemplateFormPage } from './presentation/pages/TemplateFormPage.tsx';
import { RoutesPage } from './presentation/pages/RoutesPage.tsx';
import { SettingsPage } from './presentation/pages/SettingsPage.tsx';
import { NotFoundPage } from './presentation/pages/NotFoundPage.tsx';

function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.slice(1);
      window.history.replaceState(null, '', cleanPath);
      navigate(cleanPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LegacyHashRedirect />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/templates" element={<TemplateListPage />} />
            <Route path="/templates/new" element={<TemplateFormPage mode="create" />} />
            <Route path="/templates/:id" element={<TemplateDetailPage />} />
            <Route path="/templates/:id/edit" element={<TemplateFormPage mode="edit" />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
