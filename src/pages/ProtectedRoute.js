import useEffectOnce from '@hooks/useEffectOnce';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { addUser } from '@redux/reducers/user/user.reducer';
import { userService } from '@services/api/user/user.service';
import logger from '@services/utils/logger';
import { Utils } from '@services/utils/utils.service';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
const ProtectedRoute = ({ children }) => {
  const [tokenIsValid, setTokenIsValid] = useState(null);
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    logger.info('ProtectedRoute: verifying session...');
    try {
      const response = await userService.checkCurrentUser();
      logger.info('ProtectedRoute: session valid, user =', response.data.user?.username);
      setTokenIsValid(true);
      dispatch(addUser({ token: response.data.token, profile: response.data.user }));
    } catch (error) {
      logger.warn('ProtectedRoute: session invalid —', error?.response?.status, error?.message);
      const hadSession = !!localStorage.getItem('username');
      setTokenIsValid(false);
      Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
      navigate('/auth');
      if (hadSession) {
        userService.logoutUser().catch(() => {});
      }
    }
  }, [dispatch, navigate, deleteStorageUsername, deleteSessionPageReload, setLoggedIn]);

  useEffectOnce(() => {
    checkUser();
  });

  if (tokenIsValid === null) {
    return <></>;
  }

  if (tokenIsValid) {
    return <>{children}</>;
  }

  return <Navigate to="/auth" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
