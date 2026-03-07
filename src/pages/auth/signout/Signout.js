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
    const returnUrl = new URLSearchParams(window.location.search).get('return') || '/auth';

    userService
      .logoutUser()
      .catch(() => {})
      .finally(() => {
        Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
        window.location.href = returnUrl;
      });
  }, []);

  return null;
};

export default Signout;
