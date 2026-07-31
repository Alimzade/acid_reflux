import React from 'react';
import { Language, PageView } from '../types';
import { IconMenu, IconHome, IconChess, IconGlobe, IconBook } from './Icons';

interface SidebarProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  language,
}) => {
  const copy = language === 'de'
    ? {
        toggle: 'Seitenleiste umschalten',
        expand: 'Menü öffnen',
        collapse: 'Menü schließen',
        home: 'Startseite',
        chessTitle: 'Commited (Commit-Verlauf)',
        chess: 'Commited',
        questTitle: 'Sprachen-Lernzentrum',
        quest: 'Sprachen',
        docsTitle: 'Dokumentation & Ethos',
        docs: 'Dokumentation'
      }
    : {
        toggle: 'Toggle Sidebar',
        expand: 'Expand menu',
        collapse: 'Collapse menu',
        home: 'Home',
        chessTitle: 'Commited (Commit History)',
        chess: 'Commited',
        questTitle: 'Language Learning Hub',
        quest: 'Languages',
        docsTitle: 'Documentation & Ethos',
        docs: 'Documentation'
      };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={copy.toggle}
          title={collapsed ? copy.expand : copy.collapse}
        >
          <IconMenu size={18} />
        </button>
        {!collapsed && <span className="sidebar-logo">acid_reflux</span>}
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activePage === 'pulse' ? 'active' : ''}`}
          onClick={() => setActivePage('pulse')}
          title={copy.home}
        >
          <span className="sidebar-icon"><IconHome size={18} /></span>
          {!collapsed && <span className="sidebar-text">{copy.home}</span>}
        </button>

        <button
          className={`sidebar-link ${activePage === 'quest' ? 'active' : ''}`}
          onClick={() => setActivePage('quest')}
          title={copy.questTitle}
        >
          <span className="sidebar-icon"><IconGlobe size={18} /></span>
          {!collapsed && <span className="sidebar-text">{copy.quest}</span>}
        </button>

        <button
          className={`sidebar-link ${activePage === 'chess' ? 'active' : ''}`}
          onClick={() => setActivePage('chess')}
          title={copy.chessTitle}
        >
          <span className="sidebar-icon"><IconChess size={18} /></span>
          {!collapsed && <span className="sidebar-text">{copy.chess}</span>}
        </button>

        <button
          className={`sidebar-link ${activePage === 'docs' ? 'active' : ''}`}
          onClick={() => setActivePage('docs')}
          title={copy.docsTitle}
        >
          <span className="sidebar-icon"><IconBook size={18} /></span>
          {!collapsed && <span className="sidebar-text">{copy.docs}</span>}
        </button>
      </nav>
    </aside>
  );
};
