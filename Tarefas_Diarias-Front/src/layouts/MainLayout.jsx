import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Common';

export const MainLayout = ({ children }) => {
  // sidebar aberta por padrão em desktop, fechada em mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  // fecha sidebar ao redimensionar para mobile
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = () => window.innerWidth < 768;

  return (
    <div className="app-layout">
      {/* Overlay escuro no mobile quando sidebar aberta */}
      {sidebarOpen && isMobile() && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <main
        className="main-content"
        style={{ marginLeft: sidebarOpen && window.innerWidth >= 768 ? 260 : 0 }}
      >
        {children}
      </main>
    </div>
  );
};
