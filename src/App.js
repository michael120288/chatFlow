import { AppRouter } from '@root/routes';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import '@root/App.scss';
import { socketService } from '@services/socket/socket.service';
import Toast from '@components/toast/Toast';
import { useSelector } from 'react-redux';
import ErrorBoundary from '@components/error-boundary/ErrorBoundary';

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
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
};
export default App;
