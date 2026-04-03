import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '@redux/reducers/user/user.reducer';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';

const SSOCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageReload] = useSessionStorage('pageReload', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [setStoredUsername] = useLocalStorage('username', 'set');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    const rawReturn = params.get('return');
    let safeReturn = null;
    if (rawReturn) {
      try {
        const parsed = new URL(rawReturn, window.location.origin);
        if (parsed.origin === window.location.origin) {
          safeReturn = parsed.pathname + parsed.search + parsed.hash;
        }
      } catch {
        // invalid URL — ignore
      }
    }

    authService
      .ssoLogin(token)
      .then((result) => {
        pageReload(true);
        setLoggedIn(false);
        setStoredUsername(result.data.user.username);
        dispatch(addUser({ token: result.data.token, profile: result.data.user }));
        if (safeReturn) {
          window.location.href = safeReturn;
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/auth'));
  }, []);

  return null;
};

export default SSOCallback;
