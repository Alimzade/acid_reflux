import React from 'react';
import { ProjectInfo } from '../types';

interface HeaderProps {
  info: ProjectInfo;
  activeTab: 'concept' | 'territory';
  setActiveTab: (tab: 'concept' | 'territory') => void;
}

export const Header: React.FC<HeaderProps> = ({ info, activeTab, setActiveTab }) => {
  return (
    <header className="header">
      <div className="brand">
        <h1 className="brand-title">🧪 {info.name}</h1>
        <span className="badge badge-active">Active Collaboration</span>
      </div>
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'concept' ? 'active' : ''}`}
          onClick={() => setActiveTab('concept')}
        >
          📘 Concept & Ethos
        </button>
        <button
          className={`tab-btn ${activeTab === 'territory' ? 'active' : ''}`}
          onClick={() => setActiveTab('territory')}
        >
          🗺️ Territory Claims (DB)
        </button>
      </nav>
    </header>
  );
};
