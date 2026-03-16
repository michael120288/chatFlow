import React, { useState } from 'react';

export function QuestList({ quests = [] }) {
  const [completed, setCompleted] = useState([]);

  const toggle = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const completedCount = completed.length;
  const total = quests.length;

  return (
    <div
      data-testid="quest-list"
      style={{ fontFamily: 'Segoe UI, sans-serif', background: '#0d0d2e', border: '1px solid #1a3a5e', borderRadius: '12px', padding: '24px', maxWidth: '400px', color: '#eee' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ color: '#4da6ff', fontSize: '15px', fontWeight: 'bold' }}>Active Quests</div>
        <div data-testid="progress-label" style={{ color: '#ffd700', fontSize: '12px' }}>
          {completedCount}/{total}
        </div>
      </div>
      {quests.map((q) => (
        <div
          key={q.id}
          data-testid={`quest-${q.id}`}
          onClick={() => toggle(q.id)}
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: completed.includes(q.id) ? '#0a1a0a' : '#1a1a2e',
            border: `1px solid ${completed.includes(q.id) ? '#22c55e' : '#2a2a5e'}`
          }}
        >
          <span
            data-testid={`quest-status-${q.id}`}
            style={{ color: completed.includes(q.id) ? '#22c55e' : '#555' }}
          >
            {completed.includes(q.id) ? '✓' : '○'}
          </span>
          <span
            style={{
              color: completed.includes(q.id) ? '#22c55e' : '#ccc',
              textDecoration: completed.includes(q.id) ? 'line-through' : 'none',
              fontSize: '14px'
            }}
          >
            {q.title}
          </span>
        </div>
      ))}
      {completedCount === total && total > 0 && (
        <div
          data-testid="all-complete-msg"
          style={{ marginTop: '12px', padding: '10px', background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: '6px', color: '#22c55e', textAlign: 'center', fontWeight: 'bold' }}
        >
          🏆 All quests complete!
        </div>
      )}
    </div>
  );
}
