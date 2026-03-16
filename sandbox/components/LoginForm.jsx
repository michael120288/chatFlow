import React, { useState } from 'react';

export function LoginForm({ onLogin, requiredUsername = '' }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) { setError('Username is required'); return; }
    if (!password) { setError('Password is required'); return; }
    if (requiredUsername && username !== requiredUsername) {
      setError(`Username must be "${requiredUsername}"`);
      return;
    }
    setError('');
    setSuccess(true);
    onLogin?.({ username, password });
  };

  return (
    <form
      data-testid="login-form"
      onSubmit={handleSubmit}
      style={{ fontFamily: 'Segoe UI, sans-serif', background: '#0d0d2e', border: '1px solid #2e1a00', borderRadius: '12px', padding: '28px', maxWidth: '340px', color: '#eee' }}
    >
      <div style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>🔑 Guild Login</div>

      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Username</label>
        <input
          data-testid="username-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', background: '#1a1a2e', border: '1px solid #2a2a5e', borderRadius: '6px', color: '#eee', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Password</label>
        <input
          data-testid="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', background: '#1a1a2e', border: '1px solid #2a2a5e', borderRadius: '6px', color: '#eee', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <div
          data-testid="error-msg"
          style={{ marginBottom: '14px', padding: '8px 12px', background: '#1a0a0a', border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444', fontSize: '13px' }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          data-testid="success-msg"
          style={{ marginBottom: '14px', padding: '8px 12px', background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: '6px', color: '#22c55e', fontSize: '13px' }}
        >
          ✅ Login successful!
        </div>
      )}

      <button
        data-testid="submit-btn"
        type="submit"
        style={{ width: '100%', padding: '12px', background: '#f59e0b', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
      >
        Enter the Guild
      </button>
    </form>
  );
}
