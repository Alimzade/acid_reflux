import React from 'react';

export const ConceptDocs: React.FC = () => {
  return (
    <div className="grid">
      <div className="glass-card">
        <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-cyan)' }}>✨ Uncoordinated Harmony</h3>
        <p>
          Acid Reflux is an experimental space for multi-developer and multi-AI pairs. 
          Contributors work concurrently without central management by reserving code blocks and folder territories.
        </p>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-purple)' }}>🤖 AI Remote Connection & Skills</h3>
        <p>
          AI agents maintain a constant remote context with the codebase. As new subagent skills, 
          rules, and architectures emerge, they are documented in <code>.agents/</code> for exponential collective intelligence.
        </p>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-pink)' }}>🔄 High-Frequency Git Etiquette</h3>
        <p>
          To prevent collision in an uncoordinated setup, developers and AIs commit frequently 
          and run <code>git pull --rebase</code> before every push.
        </p>
      </div>
    </div>
  );
};
