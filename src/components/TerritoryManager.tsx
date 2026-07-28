import React, { useState } from 'react';
import { Claim } from '../types';

interface TerritoryManagerProps {
  claims: Claim[];
  onAddClaim: (newClaim: Claim) => void;
}

export const TerritoryManager: React.FC<TerritoryManagerProps> = ({ claims, onAddClaim }) => {
  const [developer, setDeveloper] = useState('');
  const [aiAgent, setAiAgent] = useState('');
  const [reservedPath, setReservedPath] = useState('src/features/');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!developer || !reservedPath || !title) return;

    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      developer,
      aiAgent: aiAgent || 'Antigravity',
      reservedPath,
      title,
      description,
      status: 'active',
      timestamp: new Date().toISOString().split('T')[0]
    };

    onAddClaim(newClaim);
    setDeveloper('');
    setAiAgent('');
    setTitle('');
    setDescription('');
  };

  const handleCopyDbSnippet = () => {
    const fullDbJson = JSON.stringify({ claims }, null, 2);
    navigator.clipboard.writeText(fullDbJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Reserved Territories & Code Blocks</h2>
        <button className="tab-btn" onClick={handleCopyDbSnippet}>
          {copiedJson ? '✓ Copied DB JSON!' : '📋 Copy updated db.json to commit'}
        </button>
      </div>

      <div className="grid">
        {claims.map((claim) => (
          <div className="glass-card" key={claim.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span className="badge badge-active">{claim.status}</span>
              <small style={{ color: 'var(--text-secondary)' }}>{claim.timestamp}</small>
            </div>
            <h3 style={{ color: 'var(--accent-purple)' }}>{claim.title}</h3>
            <p style={{ margin: '0.5rem 0' }}>{claim.description}</p>
            <p><strong>Path:</strong> <code>{claim.reservedPath}</code></p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              👤 {claim.developer} | 🤖 {claim.aiAgent}
            </p>
          </div>
        ))}

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>➕ Reserve New Territory</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Developer Name(s)</label>
              <input type="text" value={developer} onChange={(e) => setDeveloper(e.target.value)} placeholder="e.g., Anar" required />
            </div>
            <div className="form-group">
              <label>AI Agent Name</label>
              <input type="text" value={aiAgent} onChange={(e) => setAiAgent(e.target.value)} placeholder="e.g., Antigravity" />
            </div>
            <div className="form-group">
              <label>Folder / Code Block Path</label>
              <input type="text" value={reservedPath} onChange={(e) => setReservedPath(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Feature Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Audio Visualizer" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of feature work..." rows={2} />
            </div>
            <button type="submit" className="btn-submit">Register Claim</button>
          </form>
        </div>
      </div>
    </div>
  );
};
