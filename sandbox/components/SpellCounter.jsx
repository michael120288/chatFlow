import React, { useState } from 'react';

export function SpellCounter({ initialCount = 0, spellName = 'Fireball', onCast }) {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    onCast?.(next);
  };

  const decrement = () => {
    if (count > 0) setCount(count - 1);
  };

  const reset = () => setCount(0);

  return (
    <div
      data-testid="spell-counter"
      style={{ fontFamily: 'Segoe UI, sans-serif', background: '#0d0d2e', border: '1px solid #4a1a7a', borderRadius: '12px', padding: '24px', maxWidth: '280px', textAlign: 'center', color: '#eee' }}
    >
      <div data-testid="spell-name" style={{ color: '#a855f7', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
        {spellName}
      </div>
      <div data-testid="count-display" style={{ fontSize: '48px', fontWeight: 'bold', color: '#a855f7', marginBottom: '16px' }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          data-testid="decrement-btn"
          onClick={decrement}
          disabled={count === 0}
          style={{ padding: '8px 16px', background: '#1a0a3e', border: '1px solid #2a1a5e', borderRadius: '6px', color: count === 0 ? '#333' : '#ccc', cursor: count === 0 ? 'not-allowed' : 'pointer' }}
        >
          −
        </button>
        <button
          data-testid="increment-btn"
          onClick={increment}
          style={{ padding: '8px 20px', background: '#4a1a7a', border: '1px solid #a855f7', borderRadius: '6px', color: '#eee', cursor: 'pointer' }}
        >
          Cast
        </button>
        <button
          data-testid="reset-btn"
          onClick={reset}
          style={{ padding: '8px 16px', background: '#1a1a2e', border: '1px solid #2a2a5e', borderRadius: '6px', color: '#888', cursor: 'pointer' }}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
