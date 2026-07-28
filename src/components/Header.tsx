import React, { useEffect, useState } from 'react';
import { ProjectInfo } from '../types';

interface HeaderProps {
  info: ProjectInfo;
  activeTab: 'concept' | 'territory';
  setActiveTab: (tab: 'concept' | 'territory') => void;
}

const COLOR_PALETTE = [
  { name: 'Cyber White', color: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' },
  { name: 'Electric Blue', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)' },
  { name: 'Matrix Green', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' },
  { name: 'Hyper Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)' },
  { name: 'Solar Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  { name: 'Tactical Red', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' }
];

export const Header: React.FC<HeaderProps> = ({ info, activeTab, setActiveTab }) => {
  const [now, setNow] = useState(() => new Date());
  const [colorIdx, setColorIdx] = useState(0);

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

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  
  // Calculate UTC offset format (e.g. UTC+02:00)
  const offsetMinutes = -now.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
  const mins = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');
  const utcOffset = `UTC${sign}${hours}:${mins}`;

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(now);

  const activeColor = COLOR_PALETTE[colorIdx];

  const handleClockClick = () => {
    setColorIdx((prev) => (prev + 1) % COLOR_PALETTE.length);
  };

  return (
    <header className="header">
      <div className="brand">
        <h1 className="brand-title">🧪 {info.name}</h1>
        <span className="badge badge-active">Active Collaboration</span>
      </div>
      <div className="header-right">
        <div className="digital-clock-unified">
          <time
            className="digital-clock-main"
            dateTime={now.toISOString()}
            aria-label={`Current time: ${time}. Click to change color theme.`}
            onClick={handleClockClick}
            title={`Theme: ${activeColor.name} (Click to cycle)`}
          >
            <span className="digital-clock-label">Local time</span>
            <span
              className="digital-clock-time"
              style={{
                color: activeColor.color,
                textShadow: `0 0 12px ${activeColor.glow}`
              }}
            >
              {time}
            </span>
          </time>
          
          <div className="clock-divider"></div>
          
          <div className="clock-tz-trigger-wrapper">
            <button className="clock-tz-square-btn" aria-label="Timezone Information">
              🌐
            </button>
            <div className="clock-tooltip">
              <div className="tooltip-row">
                <span className="tooltip-label">Timezone:</span>
                <span className="tooltip-value">{timeZone}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-label">Offset:</span>
                <span className="tooltip-value">{utcOffset}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-label">Date:</span>
                <span className="tooltip-value">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

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
