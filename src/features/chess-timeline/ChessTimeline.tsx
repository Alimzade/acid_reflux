import React, { useEffect, useState } from 'react';
import { IconChess } from '../../components/Icons';

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  author?: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

const CHESS_PIECES = ['♔ e4', '♞ Nf3', '♗ Bc4', '♟ d4', '♞ Nc3', '♜ Re1', '♛ Qe2', '♝ Bg5'];

export const ChessTimeline: React.FC = () => {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommits() {
      try {
        setLoading(true);
        const res = await fetch('https://api.github.com/repos/Alimzade/acid_reflux/commits?per_page=30');
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.statusText}`);
        }
        const data: GitHubCommit[] = await res.json();
        setCommits(data);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch GitHub commits';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    void fetchCommits();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <IconChess size={24} color="var(--accent-purple)" />
            <h2>Chess Match Commit Log</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Live GitHub commit history styled as tactical chess moves
          </p>
        </div>
        <span className="badge badge-active">{commits.length} Moves Recorded</span>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Fetching live commit history from GitHub...
        </div>
      ) : error ? (
        <div className="market-notice">
          {error} — Displaying recent repository activity.
        </div>
      ) : (
        <div className="chess-timeline-container">
          {commits.map((item, index) => {
            const isWhite = index % 2 === 0;
            const piece = CHESS_PIECES[index % CHESS_PIECES.length];
            const shortSha = item.sha.substring(0, 7);
            const dateStr = new Date(item.commit.author.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const lines = item.commit.message.split('\n').filter(Boolean);
            const title = lines[0];
            const details = lines.slice(1);

            return (
              <div
                key={item.sha}
                className={`chess-move-card ${isWhite ? 'move-white' : 'move-black'}`}
              >
                <div className="move-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="move-badge">Move #{commits.length - index} ({piece})</span>
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}
                    >
                      {title}
                    </a>
                  </div>
                  <a href={item.html_url} target="_blank" rel="noreferrer" className="commit-hash">
                    {shortSha} ↗
                  </a>
                </div>

                {details.length > 0 && (
                  <div style={{ margin: '0.8rem 0' }}>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {details.map((detail, idx) => (
                        <li key={idx} style={{ marginBottom: '0.2rem' }}>{detail.replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="move-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.author?.avatar_url && (
                      <img
                        src={item.author.avatar_url}
                        alt={item.commit.author.name}
                        style={{ width: 18, height: 18, borderRadius: '50%' }}
                      />
                    )}
                    <span>👤 {item.author?.login || item.commit.author.name}</span>
                  </div>
                  <span>📅 {dateStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
