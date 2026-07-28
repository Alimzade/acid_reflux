import React from 'react';
import { PageView } from '../types';
import { IconMenu, IconHome, IconChess, IconMap, IconBook } from './Icons';

interface SidebarProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
}) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
          title={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <IconMenu size={18} />
        </button>
        {!collapsed && <span className="sidebar-logo">acid_reflux</span>}
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activePage === 'pulse' ? 'active' : ''}`}
          onClick={() => setActivePage('pulse')}
          title="Home"
        >
          <span className="sidebar-icon"><IconHome size={18} /></span>
          {!collapsed && <span className="sidebar-text">Home</span>}
        </button>

        <button
          className={`sidebar-link ${activePage === 'chess' ? 'active' : ''}`}
          onClick={() => setActivePage('chess')}
          title="Chess Match (Commit History)"
        >
          <span className="sidebar-icon"><IconChess size={18} /></span>
          {!collapsed && <span className="sidebar-text">Chess Timeline</span>}
        </button>

        <button
          className={`sidebar-link ${activePage === 'docs' ? 'active' : ''}`}
          onClick={() => setActivePage('docs')}
          title="Documentation & Ethos"
        >
          <span className="sidebar-icon"><IconBook size={18} /></span>
          {!collapsed && <span className="sidebar-text">Documentation</span>}
        </button>
      </nav>
    </aside>
  );
};
