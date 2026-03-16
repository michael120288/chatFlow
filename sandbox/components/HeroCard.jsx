import React from 'react';

export function HeroCard({ name, heroClass, level, guild, isActive = false }) {
  return (
    <div
      data-testid="hero-card"
      style={{
        fontFamily: 'Segoe UI, sans-serif',
        background: '#0d0d2e',
        border: `2px solid ${isActive ? '#22c55e' : '#2a2a5e'}`,
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '300px',
        color: '#eee'
      }}
    >
      <div data-testid="hero-name" style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffd700', marginBottom: '8px' }}>
        {name}
      </div>
      <div data-testid="hero-class" style={{ color: '#4da6ff', fontSize: '13px', marginBottom: '4px' }}>
        {heroClass}
      </div>
      <div data-testid="hero-level" style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>
        Level {level}
      </div>
      <div data-testid="hero-guild" style={{ color: '#666', fontSize: '12px' }}>
        {guild}
      </div>
      {isActive && (
        <div
          data-testid="active-badge"
          style={{ marginTop: '10px', padding: '4px 8px', background: '#0a2e0a', border: '1px solid #22c55e', borderRadius: '10px', fontSize: '11px', color: '#22c55e', display: 'inline-block' }}
        >
          ● Active
        </div>
      )}
    </div>
  );
}
