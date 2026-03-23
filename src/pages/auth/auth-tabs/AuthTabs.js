import { useEffect, useState } from 'react';
import '@pages/auth/auth-tabs/AuthTabs.scss';
import Login from '@pages/auth/login/Login';
import Register from '@pages/auth/register/Register';
import useLocalStorage from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Utils } from '@services/utils/utils.service';
import PageLoader from '@components/page-loader/PageLoader';

const FEATURES = [
  { icon: '🧪', text: '39 interactive UI scenarios' },
  { icon: '💬', text: 'Real-time social platform to automate' },
  { icon: '⚔️', text: 'Playwright & Cypress learning game' }
];

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [environment, setEnvironment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    if (keepLoggedIn) navigate('/');
  }, [keepLoggedIn, navigate]);

  return (
    <>
      {keepLoggedIn ? (
        <PageLoader />
      ) : (
        <div className="auth-page">
          {/* Left branding panel */}
          <div className="auth-left">
            <div className="auth-left-top">
              <div className="auth-brand">
                <span className="auth-brand-dot" />
                QA Hub
              </div>
            </div>
            <div className="auth-left-body">
              <h1 className="auth-headline">Master QA Automation</h1>
              <p className="auth-subline">
                Your all-in-one playground for Playwright &amp; Cypress — practise on real UIs, automate a social
                platform, and level up with interactive challenges.
              </p>
              <ul className="auth-features">
                {FEATURES.map((f) => (
                  <li key={f.text} className="auth-feature-item">
                    <span className="auth-feature-icon">{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
            {environment && <div className="auth-env-badge">{environment}</div>}
          </div>

          {/* Right form panel */}
          <div className="auth-right">
            <button className="auth-home-btn" onClick={() => navigate('/')}>
              ← Home
            </button>

            <div className="auth-right-inner">
              <div className="auth-right-header">
                <h2 className="auth-right-title">{type === 'Sign In' ? 'Welcome back' : 'Create account'}</h2>
                <p className="auth-right-subtitle">
                  {type === 'Sign In' ? 'Sign in to your QA Hub account' : 'Join QA Hub and start practising'}
                </p>
              </div>

              <div className="auth-tab-pills">
                <button
                  className={`auth-tab-pill ${type === 'Sign In' ? 'active' : ''}`}
                  onClick={() => setType('Sign In')}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab-pill ${type === 'Sign Up' ? 'active' : ''}`}
                  onClick={() => setType('Sign Up')}
                >
                  Sign Up
                </button>
              </div>

              <div className="auth-form-wrap">{type === 'Sign In' ? <Login /> : <Register />}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthTabs;
