import React, { useEffect, useState } from 'react';
import { ProjectInfo } from '../types';

interface HeaderProps {
  info: ProjectInfo;
  activeTab: 'concept' | 'territory';
  setActiveTab: (tab: 'concept' | 'territory') => void;
}

export const Header: React.FC<HeaderProps> = ({ info, activeTab, setActiveTab }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);

  return (
    <header className="header">
      <div className="brand">
        <h1 className="brand-title">🧪 {info.name}</h1>
        <span className="badge badge-active">Active Collaboration</span>
      </div>
      <div className="header-right">
        <time className="digital-clock" dateTime={now.toISOString()} aria-label={`Current time: ${time}`}>
          <span className="digital-clock-label">Local time</span>
          <span className="digital-clock-time">{time}</span>
        </time>
        <nav className="nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'concept' ? 'active' : ''}`}
            onClick={() => setActiveTab('concept')}
          >
            📘 Concept &amp; Ethos
          </button>
          <button
            className={`tab-btn ${activeTab === 'territory' ? 'active' : ''}`}
            onClick={() => setActiveTab('territory')}
          >
            🗺️ Territory Claims (DB)
          </button>
        </nav>
      </div>
    </header>
  );
};
