import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarketPulse } from './features/market-pulse/MarketPulse';
import { ChessTimeline } from './features/chess-timeline/ChessTimeline';
import { ConceptDocs } from './components/ConceptDocs';
import dbData from './data/db.json';
import { Database, PageView } from './types';

const PATH_MAP: Record<string, PageView> = {
  '/home': 'pulse',
  '/chess': 'chess',
  '/docs': 'docs',
  '/': 'pulse'
};

const PAGE_TO_PATH: Record<PageView, string> = {
  pulse: 'home',
  chess: 'chess',
  docs: 'docs'
};

export function App() {
  const [db] = useState<Database>(dbData as Database);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const getInitialPage = (): PageView => {
    const rawPath = window.location.pathname;
    const path = rawPath.replace(/.*\/acid_reflux/, '').replace(/\/$/, '') || '/';
    return PATH_MAP[path] || 'pulse';
  };

  const [activePage, setActivePage] = useState<PageView>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      const rawPath = window.location.pathname;
      const path = rawPath.replace(/.*\/acid_reflux/, '').replace(/\/$/, '') || '/';
      const page = PATH_MAP[path] || 'pulse';
      setActivePage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePageChange = (page: PageView) => {
    setActivePage(page);
    const basePath = window.location.pathname.includes('/acid_reflux') ? '/acid_reflux' : '';
    const newUrl = `${basePath}/${PAGE_TO_PATH[page]}`;
    window.history.pushState(null, '', newUrl);
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="main-content-wrapper">
        <Header
          info={db.projectInfo}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        <main className="page-content">
          {activePage === 'pulse' && <MarketPulse />}
          {activePage === 'chess' && <ChessTimeline />}
          {activePage === 'docs' && <ConceptDocs />}
        </main>
      </div>
    </div>
  );
}

export default App;
