import React, { useState } from 'react';
import { Language } from '../types';
import './ConceptDocs.css';

export const ConceptDocs: React.FC<{ language: Language }> = ({ language }) => {
  const isGerman = language === 'de';
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const copy = isGerman ? {
    kicker: 'SYSTEM-DOKUMENTATION & ETHOS',
    title: 'Dokumentation',
    subtitle: 'Standards, Architektur, Git-Etikette und Richtlinien für autonome Entwicklung.'
  } : {
    kicker: 'SYSTEM ARCHITECTURE & ETHOS',
    title: 'Documentation',
    subtitle: 'Standards, architecture, Git etiquette, and guidelines for autonomous development.'
  };

  const navItems = [
    { id: 'getting-started', label: isGerman ? '1. Overview & Setup' : '1. Overview & Setup' },
    { id: 'harmony', label: isGerman ? '2. Uncoordinated Harmony' : '2. Uncoordinated Harmony' },
    { id: 'git-etiquette', label: isGerman ? '3. Git Etiquette & Workflow' : '3. Git Etiquette & Workflow' },
    { id: 'design-system', label: isGerman ? '4. Design System Tokens' : '4. Design System Tokens' },
    { id: 'ai-skills', label: isGerman ? '5. AI Agents & Architecture' : '5. AI Agents & Architecture' },
  ];

  return (
    <div className="docs-page-container">
      {/* Standardized Header Section */}
      <header className="market-pulse-header" style={{ marginBottom: '0.5rem' }}>
        <div>
          <span className="section-kicker">{copy.kicker}</span>
          <h1 className="lang-title" style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>{copy.title}</h1>
          <p style={{ marginTop: '0.45rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>{copy.subtitle}</p>
        </div>
      </header>

      {/* Unified Single Glass Card Container (Menu Box & Content Area Combined) */}
      <div className="docs-unified-card glass-card">
        {/* Internal Navigation Menu */}
        <nav className="docs-unified-nav">
          <span className="docs-nav-title">{isGerman ? 'INHALT' : 'ON THIS PAGE'}</span>
          <ul className="docs-nav-list">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`docs-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="docs-nav-indicator" />
                  <span className="docs-nav-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Article Reading Area */}
        <main className="docs-unified-content">
          {activeSection === 'getting-started' && (
            <article className="docs-article">
              <h2>1. Overview & Setup</h2>
              <p className="docs-lead">
                {isGerman
                  ? 'Acid Reflux ist eine hochmoderne Webanwendung, die für synchrone und asynchrone Multi-Agenten-Entwicklung entwickelt wurde.'
                  : 'Acid Reflux is a modern web application engineered for synchronous and asynchronous multi-agent pairing.'}
              </p>

              <h3>{isGerman ? 'Kernkomponenten' : 'Core Components'}</h3>
              <ul className="docs-bullets">
                <li><strong>{isGerman ? 'Markt- & KI-Puls:' : 'Market & AI Pulse:'}</strong> {isGerman ? 'Echtzeit-Nachrichten und Trends.' : 'Real-time financial and AI intelligence feed.'}</li>
                <li><strong>{isGerman ? 'Sprachen-Lernzentrum:' : 'Language Learning Hub:'}</strong> {isGerman ? '33 Weltsprachen sortiert nach CEFR-Niveau (A1–C2).' : '33 global languages categorized by CEFR level (A1–C2).'}</li>
                <li><strong>{isGerman ? 'Commited Log:' : 'Commited Log:'}</strong> {isGerman ? 'Live-GitHub-Verlauf visualisiert als taktische Züge.' : 'Live GitHub commit stream styled as tactical chess moves.'}</li>
              </ul>

              <div className="docs-callout callout-note">
                <span className="callout-label">NOTE</span>
                <p>{isGerman ? 'Nutzen Sie die Sprachen-Suche und das Tastatur-Tippen für direkte Auswahlen.' : 'Keyboard type-ahead allows instant language selection on the Languages page without opening dropdowns.'}</p>
              </div>
            </article>
          )}

          {activeSection === 'harmony' && (
            <article className="docs-article">
              <h2>2. Uncoordinated Harmony</h2>
              <p className="docs-lead">
                {isGerman
                  ? 'Entwickler und KI-Agenten arbeiten autonom, ohne zentrale Steuerung oder gegenseitige Blockaden.'
                  : 'Developers and AI agents operate autonomously without central management or blocking dependencies.'}
              </p>

              <h3>{isGerman ? 'Prinzipien der Entkopplung' : 'Decoupling Architecture'}</h3>
              <ul className="docs-bullets">
                <li><strong>Territorial Boundaries:</strong> Modularization by features under <code>src/features/</code>.</li>
                <li><strong>Local State Isolation:</strong> Zero unnecessary global mutations, scoped component states.</li>
                <li><strong>Autonomous Verification:</strong> TypeScript compilation check via <code>npx tsc --noEmit</code> before staging.</li>
              </ul>
            </article>
          )}

          {activeSection === 'git-etiquette' && (
            <article className="docs-article">
              <h2>3. Git Etiquette & Workflow</h2>
              <p className="docs-lead">
                {isGerman
                  ? 'Klare Commit-Regeln sichern die Nachvollziehbarkeit im Repository.'
                  : 'Strict git rules ensure clean history and seamless multi-agent integration.'}
              </p>

              <div className="docs-callout callout-note">
                <span className="callout-label">RULES</span>
                <ul>
                  <li>{isGerman ? 'Commit-Nachrichten enthalten eine Betreffzeile und Stichpunkte mit Bindestrichen `-`.' : 'Commit messages must feature a concise title followed by main changes with dashes `-`.'}</li>
                  <li>{isGerman ? 'Vor jedem Push wird `git pull --rebase` ausgeführt.' : 'Always run `git pull --rebase` before pushing changes.'}</li>
                  <li>{isGerman ? 'Keine anonymen Nachnamen in Benutzeroberflächen.' : 'No surnames or personal identifiers in public UI copy.'}</li>
                </ul>
              </div>
            </article>
          )}

          {activeSection === 'design-system' && (
            <article className="docs-article">
              <h2>4. Design System Tokens</h2>
              <p className="docs-lead">
                {isGerman
                  ? 'Einheitliches dunkles Glassmorphismus-Designsystem basierend auf CSS-Variablen.'
                  : 'Unified dark glassmorphism design system driven exclusively by CSS variables.'}
              </p>

              <h3>{isGerman ? 'Design-Token' : 'Color & Font Tokens'}</h3>
              <div className="docs-code-card">
                <code>--accent-cyan: #06b6d4;</code><br />
                <code>--accent-purple: #a855f7;</code><br />
                <code>--accent-pink: #ec4899;</code><br />
                <code>--font-main: 'Inter', sans-serif;</code><br />
                <code>--font-code: 'JetBrains Mono', monospace;</code>
              </div>

              <h3>{isGerman ? 'Glassmorphismus-Standard' : 'Glassmorphism Standard'}</h3>
              <p>
                {isGerman
                  ? 'Alle Karten müssen `.glass-card` nutzen oder `backdrop-filter: blur(12px)` mit subtilem Rahmen `rgba(255,255,255,0.08)` anwenden.'
                  : 'All cards must implement `.glass-card` or apply `backdrop-filter: blur(12px)` with subtle border `rgba(255,255,255,0.08)`.'}
              </p>
            </article>
          )}

          {activeSection === 'ai-skills' && (
            <article className="docs-article">
              <h2>5. AI Agents & Architecture</h2>
              <p className="docs-lead">
                {isGerman
                  ? 'Erweiterbare Agenten-Architektur mit spezialisierten Unteragenten und benutzerdefinierten Fähigkeiten.'
                  : 'Extensible agent architecture powered by specialized subagents and custom skill modules.'}
              </p>

              <h3>{isGerman ? 'Agenten-Regeln' : 'Agent Rules'}</h3>
              <p>
                {isGerman
                  ? 'Die Regeln in `AGENTS.md` steuern das Verhalten aller KI-Agenten bezüglich Git-Etikette, Typensicherheit und Designstandards.'
                  : 'Rules in `AGENTS.md` govern all AI agent behaviors regarding Git etiquette, type checking, and design system adherence.'}
              </p>
            </article>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConceptDocs;
