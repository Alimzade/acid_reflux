import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarketPulse } from './features/market-pulse/MarketPulse';
import { ChessTimeline } from './features/chess-timeline/ChessTimeline';
import { ConceptDocs } from './components/ConceptDocs';
import dbData from './data/db.json';
import { Database, PageView } from './types';

export function App() {
  const [db] = useState<Database>(dbData as Database);
  const [activePage, setActivePage] = useState<PageView>('pulse');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
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
