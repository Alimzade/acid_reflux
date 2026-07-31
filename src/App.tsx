import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarketPulse } from './features/market-pulse/MarketPulse';
import { ChessTimeline } from './features/chess-timeline/ChessTimeline';
import { DailyDuoQuest } from './features/daily-duo-quest/DailyDuoQuest';
import { ConceptDocs } from './components/ConceptDocs';
import dbData from './data/db.json';
import { Database, Language, PageView } from './types';

const PATH_MAP: Record<string, PageView> = {
  '/home': 'pulse',
  '/chess': 'chess',
  '/quest': 'quest',
  '/docs': 'docs',
  '/': 'pulse'
};

const PAGE_TO_PATH: Record<PageView, string> = {
  pulse: 'home',
  chess: 'chess',
  quest: 'quest',
  docs: 'docs'
};

export function App() {
  const [db] = useState<Database>(dbData as Database);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem('acid-reflux-language');
    return saved === 'de' || saved === 'en' ? saved : 'de';
  });

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

  useEffect(() => {
    window.localStorage.setItem('acid-reflux-language', language);
    document.documentElement.lang = language;
  }, [language]);

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
        language={language}
      />

      <div className="main-content-wrapper">
        <Header
          info={db.projectInfo}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="page-content">
          {activePage === 'pulse' && <MarketPulse language={language} />}
          {activePage === 'chess' && <ChessTimeline language={language} />}
          {activePage === 'quest' && <DailyDuoQuest language={language} />}
          {activePage === 'docs' && <ConceptDocs language={language} />}
        </main>
      </div>
    </div>
  );
}

export default App;
