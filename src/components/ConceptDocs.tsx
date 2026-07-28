import React from 'react';
import { Language } from '../types';

export const ConceptDocs: React.FC<{ language: Language }> = ({ language }) => {
  const isGerman = language === 'de';

  return (
    <div className="grid">
      <div className="glass-card">
        <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-cyan)' }}>
          {isGerman ? '✨ Unkoordinierte Harmonie' : '✨ Uncoordinated Harmony'}
        </h3>
        <p>
          {isGerman
            ? 'Acid Reflux ist ein experimenteller Raum für Teams aus mehreren Entwicklern und KI-Agenten. Mitwirkende arbeiten gleichzeitig und ohne zentrale Leitung, indem sie Codebereiche und Ordner reservieren.'
            : 'Acid Reflux is an experimental space for multi-developer and multi-AI pairs. Contributors work concurrently without central management by reserving code blocks and folder territories.'}
        </p>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-purple)' }}>
          {isGerman ? '🤖 KI-Verbindung & Fähigkeiten' : '🤖 AI Remote Connection & Skills'}
        </h3>
        <p>
          {isGerman
            ? <>KI-Agenten behalten einen dauerhaften Kontext zur Codebasis. Neue Fähigkeiten, Regeln und Architekturen werden unter <code>.agents/</code> dokumentiert, damit die gemeinsame Intelligenz wachsen kann.</>
            : <>AI agents maintain a constant remote context with the codebase. As new subagent skills, rules, and architectures emerge, they are documented in <code>.agents/</code> for exponential collective intelligence.</>}
        </p>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-pink)' }}>
          {isGerman ? '🔄 Git-Etikette für häufige Änderungen' : '🔄 High-Frequency Git Etiquette'}
        </h3>
        <p>
          {isGerman
            ? <>Um Konflikte bei der parallelen Arbeit zu vermeiden, committen Entwickler und KI-Agenten häufig und führen vor jedem Push <code>git pull --rebase</code> aus.</>
            : <>To prevent collision in an uncoordinated setup, developers and AIs commit frequently and run <code>git pull --rebase</code> before every push.</>}
        </p>
      </div>
    </div>
  );
};
