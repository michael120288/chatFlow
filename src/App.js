import { AppRouter } from '@root/routes';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import '@root/App.scss';
import { socketService } from '@services/socket/socket.service';
import Toast from '@components/toast/Toast';
import { useSelector } from 'react-redux';
import ErrorBoundary from '@components/error-boundary/ErrorBoundary';

const ROUTE_TITLES = {
  '/': 'Code and Test — QA Practice & Playwright Learning Platform',
  '/auth': 'Sign In — Code and Test',
  '/forgot-password': 'Forgot Password — Code and Test',
  '/reset-password': 'Reset Password — Code and Test',
  '/qa-practice': 'QA Practice Scenarios — Code and Test',
  '/css-selectors': 'CSS Selector Academy — Code and Test',
  '/app/social/streams': 'Streams — Code and Test',
  '/app/social/chat/messages': 'Chat — Code and Test',
  '/app/social/people': 'People — Code and Test',
  '/app/social/followers': 'Followers — Code and Test',
  '/app/social/following': 'Following — Code and Test',
  '/app/social/photos': 'Photos — Code and Test',
  '/app/social/videos': 'Videos — Code and Test',
  '/app/social/notifications': 'Notifications — Code and Test',
  '/app/social/flashcards': 'Flashcards — Code and Test',
  '/app/game': 'Test Quest — Code and Test'
};

const scrollPositions = {};

const CanonicalTag = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', 'https://codeandtest.com' + pathname);

    const qaMatch = pathname.startsWith('/qa-practice/');
    if (qaMatch) {
      const scenario = pathname
        .replace('/qa-practice/', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      document.title = `${scenario} Practice — Code and Test`;
    } else {
      document.title = ROUTE_TITLES[pathname] ?? 'Code and Test — QA Practice & Playwright Learning Platform';
    }
  }, [pathname]);
  return null;
};

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
        <CanonicalTag />
        <ScrollRestorer />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
};
export default App;
