import React, { useEffect, useState } from 'react';
import { Language, ProjectInfo } from '../types';
import { IconGlobe } from './Icons';

interface HeaderProps {
  info: ProjectInfo;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const COLOR_PALETTE = [
  { name: 'Cyber White', color: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' },
  { name: 'Electric Blue', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)' },
  { name: 'Matrix Green', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' },
  { name: 'Hyper Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)' },
  { name: 'Solar Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  { name: 'Tactical Red', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' }
];

export const Header: React.FC<HeaderProps> = ({
  info,
  sidebarCollapsed,
  setSidebarCollapsed,
  language,
  setLanguage
}) => {
  const [now, setNow] = useState(() => new Date());
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const locale = language === 'de' ? 'de-DE' : 'en-US';
  const time = new Intl.DateTimeFormat(locale, {
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

  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(now);

  const activeColor = COLOR_PALETTE[colorIdx];
  const copy = language === 'de'
    ? {
        collaboration: 'Aktive Zusammenarbeit',
        currentTime: 'Aktuelle Uhrzeit',
        changeColor: 'Klicken, um die Farbe zu ändern',
        theme: 'Design',
        cycle: 'Zum Wechseln klicken',
        localTime: 'Ortszeit',
        timezoneInfo: 'Zeitzoneninformationen',
        timezone: 'Zeitzone:',
        offset: 'Abweichung:',
        date: 'Datum:',
        language: 'Sprache'
      }
    : {
        collaboration: 'Active Collaboration',
        currentTime: 'Current time',
        changeColor: 'Click to change color theme',
        theme: 'Theme',
        cycle: 'Click to cycle',
        localTime: 'Local time',
        timezoneInfo: 'Timezone Information',
        timezone: 'Timezone:',
        offset: 'Offset:',
        date: 'Date:',
        language: 'Language'
      };

  const handleClockClick = () => {
    setColorIdx((prev) => (prev + 1) % COLOR_PALETTE.length);
  };

  return (
    <header className="header">
      <div className="brand">
        <span className="badge badge-active">{copy.collaboration}</span>
      </div>
      <div className="header-right">
        <div className="language-switch" role="group" aria-label={copy.language}>
          <button
            type="button"
            className={language === 'en' ? 'active' : ''}
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
          >
            EN
          </button>
          <button
            type="button"
            className={language === 'de' ? 'active' : ''}
            onClick={() => setLanguage('de')}
            aria-pressed={language === 'de'}
          >
            DE
          </button>
        </div>
        <div className="digital-clock-unified">
          <time
            className="digital-clock-main"
            dateTime={now.toISOString()}
            aria-label={`${copy.currentTime}: ${time}. ${copy.changeColor}.`}
            onClick={handleClockClick}
            title={`${copy.theme}: ${activeColor.name} (${copy.cycle})`}
          >
            <span className="digital-clock-label">{copy.localTime}</span>
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
            <button className="clock-tz-square-btn" aria-label={copy.timezoneInfo}>
              <IconGlobe size={15} />
            </button>
            <div className="clock-tooltip">
              <div className="tooltip-row">
                <span className="tooltip-label">{copy.timezone}</span>
                <span className="tooltip-value">{timeZone}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-label">{copy.offset}</span>
                <span className="tooltip-value">{utcOffset}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-label">{copy.date}</span>
                <span className="tooltip-value">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
