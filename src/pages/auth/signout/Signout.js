import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { Utils } from '@services/utils/utils.service';
import { userService } from '@services/api/user/user.service';

const Signout = () => {
  const dispatch = useDispatch();
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');

  useEffect(() => {
    const rawReturn = new URLSearchParams(window.location.search).get('return') || '/auth';
    let returnUrl = '/auth';
    try {
      const parsed = new URL(rawReturn, window.location.origin);
      if (parsed.origin === window.location.origin) {
        returnUrl = parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      // invalid URL — fall back to /auth
    }

    userService
      .logoutUser()
      .catch(() => {})
      .finally(() => {
        Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
        window.location.href = returnUrl;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional run-once on mount: sign out and redirect
  }, []);

  return null;
};

export default Signout;
