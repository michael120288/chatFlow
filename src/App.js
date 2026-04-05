import { AppRouter } from '@root/routes';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import '@root/App.scss';
import { socketService } from '@services/socket/socket.service';
import Toast from '@components/toast/Toast';
import { useSelector } from 'react-redux';
import ErrorBoundary from '@components/error-boundary/ErrorBoundary';

const scrollPositions = {};

const ScrollRestorer = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const saved = scrollPositions[pathname];
    if (saved !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    } else {
      window.scrollTo(0, 0);
    }
    return () => {
      scrollPositions[prevPathname.current] = window.scrollY;
      prevPathname.current = pathname;
    };
  }, [pathname]);

  return null;
};

const App = () => {
  const { notifications, user } = useSelector((state) => state);

  useEffect(() => {
    if (user?.token) {
      socketService.setupSocketConnection();
    }
  }, [user?.token]);

  return (
    <>
      {notifications && notifications.length > 0 && (
        <Toast position="top-right" toastList={notifications} autoDelete={true} />
      )}
      <BrowserRouter>
        <ScrollRestorer />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
};
export default App;
