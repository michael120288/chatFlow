import '@pages/auth/reset-password/ResetPassword.scss';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '@services/api/auth/auth.service';
import { Utils } from '@services/utils/utils.service';

const FEATURES = [
  { icon: '🧪', text: '46 interactive UI scenarios' },
  { icon: '💬', text: 'Real-time social platform to automate' },
  { icon: '⚔️', text: 'Playwright & Cypress learning game' }
];

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [searchParams] = useSearchParams();
  const environment = Utils.appEnvironment();

  const resetPassword = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const body = { password, confirmPassword };
      const response = await authService.resetPassword(searchParams.get('token'), body);
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
      setShowAlert(false);
      setAlertType('alert-success');
      setResponseMessage(response?.data?.message);
    } catch (error) {
      setAlertType('alert-error');
      setLoading(false);
      setShowAlert(true);
      setResponseMessage(error?.response?.data?.message);
    }
  };

  return (
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
            Your all-in-one playground for Playwright &amp; Cypress — practise on real UIs, automate a social platform,
            and level up with interactive challenges.
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
        <Link to="/auth" className="auth-home-btn" style={{ textDecoration: 'none' }}>
          ← Back to Sign In
        </Link>

        <div className="auth-right-inner">
          <div className="auth-right-header">
            <h2 className="auth-right-title">Reset password</h2>
            <p className="auth-right-subtitle">Choose a strong new password for your account.</p>
          </div>

          {responseMessage && (
            <div className={`alerts ${alertType}`} role="alert">
              {responseMessage}
            </div>
          )}

          <form className="auth-form-shared" onSubmit={resetPassword}>
            <div className="form-input-container">
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                labelText="New Password"
                placeholder="Enter new password"
                style={{ border: `${showAlert ? '1.5px solid #fca5a5' : ''}` }}
                handleChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="cpassword"
                name="cpassword"
                type="password"
                value={confirmPassword}
                labelText="Confirm Password"
                placeholder="Confirm new password"
                style={{ border: `${showAlert ? '1.5px solid #fca5a5' : ''}` }}
                handleChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              label={`${loading ? 'Resetting password…' : 'Reset Password'}`}
              className="auth-button button"
              disabled={!password || !confirmPassword}
            />
            <Link to="/auth">
              <span className="back-to-login">
                <FaArrowLeft size={11} /> Back to Sign In
              </span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
