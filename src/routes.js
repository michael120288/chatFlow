import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
import { Home } from '@pages/home';
import SSOCallback from '@pages/auth/sso/SSOCallback';
import Signout from '@pages/auth/signout/Signout';
import { QAPractice } from '@pages/qa-practice';
import QAPracticeLanding from '@pages/qa-practice/QAPracticeLanding';
import Error from '@pages/error/Error';
import ProtectedRoute from '@pages/ProtectedRoute';
import { GameSection } from '@pages/game/GameSection';
import { GameHome } from '@pages/game/GameHome';
import { Track } from '@pages/game/Track';
import { Game } from '@pages/game/Game';
import { LevelComplete } from '@pages/game/LevelComplete';
import { SelectorAcademy } from '@pages/selectors/SelectorAcademy';
import { useRoutes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import CardSkeleton from '@components/card-element/CardSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
import ProfileSkeleton from '@pages/social/profile/ProfileSkeleton';
import ChatSkeleton from '@pages/social/chat/ChatSkeleton';
import VideoSkeleton from '@pages/social/videos/VideoSkeleton';

const Social = lazy(() => import('@pages/social/Social'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notification = lazy(() => import('@pages/social/notifications/Notification'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Videos = lazy(() => import('@pages/social/videos/Videos'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));
const Cards = lazy(() => import('@pages/social/flashcards/Cards'));
const PracticeMode = lazy(() => import('@pages/social/flashcards/PracticeMode'));
const Bookmarks = lazy(() => import('@pages/social/flashcards/Bookmarks'));
const MyDecks = lazy(() => import('@pages/social/flashcards/MyDecks'));
const DeckDetail = lazy(() => import('@pages/social/flashcards/DeckDetail'));
const DeckPractice = lazy(() => import('@pages/social/flashcards/DeckPractice'));

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/qa-practice',
      children: [
        {
          index: true,
          element: <QAPracticeLanding />
        },
        {
          path: 'web-inputs',
          element: <QAPractice />
        },
        {
          path: 'dynamic-table',
          element: <QAPractice />
        },
        {
          path: 'drag-and-drop',
          element: <QAPractice />
        },
        {
          path: 'iframe',
          element: <QAPractice />
        },
        {
          path: 'file-upload',
          element: <QAPractice />
        },
        {
          path: 'alerts-modals',
          element: <QAPractice />
        },
        {
          path: 'navigation',
          element: <QAPractice />
        },
        {
          path: 'tooltips',
          element: <QAPractice />
        },
        {
          path: 'loaders',
          element: <QAPractice />
        },
        {
          path: 'accordion',
          element: <QAPractice />
        },
        {
          path: 'tabs',
          element: <QAPractice />
        },
        {
          path: 'carousel',
          element: <QAPractice />
        },
        {
          path: 'search-filters',
          element: <QAPractice />
        },
        {
          path: 'breadcrumbs',
          element: <QAPractice />
        },
        {
          path: 'context-menu',
          element: <QAPractice />
        },
        {
          path: 'copy-clipboard',
          element: <QAPractice />
        },
        {
          path: 'rating',
          element: <QAPractice />
        },
        {
          path: 'wizard',
          element: <QAPractice />
        },
        {
          path: 'infinite-scroll',
          element: <QAPractice />
        },
        {
          path: 'sticky-elements',
          element: <QAPractice />
        },
        {
          path: 'local-storage',
          element: <QAPractice />
        },
        {
          path: 'cookies',
          element: <QAPractice />
        },
        {
          path: 'api-testing',
          element: <QAPractice />
        },
        {
          path: 'form-validation',
          element: <QAPractice />
        },
        {
          path: 'authentication',
          element: <QAPractice />
        },
        {
          path: 'download-files',
          element: <QAPractice />
        },
        {
          path: 'notifications',
          element: <QAPractice />
        },
        {
          path: 'keyboard-nav',
          element: <QAPractice />
        },
        {
          path: 'autocomplete',
          element: <QAPractice />
        },
        {
          path: 'multi-select',
          element: <QAPractice />
        },
        {
          path: 'date-time-picker',
          element: <QAPractice />
        },
        {
          path: 'dark-mode',
          element: <QAPractice />
        },
        {
          path: 'nested-dropdowns',
          element: <QAPractice />
        },
        {
          path: 'error-boundary',
          element: <QAPractice />
        },
        {
          path: 'disabled-readonly',
          element: <QAPractice />
        },
        {
          path: 'progress',
          element: <QAPractice />
        },
        {
          path: 'virtual-scroll',
          element: <QAPractice />
        },
        {
          path: 'websocket',
          element: <QAPractice />
        },
        {
          path: 'credit-card',
          element: <QAPractice />
        },
        {
          path: 'shadow-dom',
          element: <QAPractice />
        },
        {
          path: 'multi-tab',
          element: <QAPractice />
        },
        {
          path: 'viewport',
          element: <QAPractice />
        },
        {
          path: 'rich-text-editor',
          element: <QAPractice />
        },
        {
          path: 'soft-assertions',
          element: <QAPractice />
        },
        {
          path: 'wait-for-request',
          element: <QAPractice />
        },
        {
          path: 'visual-testing',
          element: <QAPractice />
        }
      ]
    },
    {
      path: '/auth',
      element: <AuthTabs />
    },
    {
      path: '/sso',
      element: <SSOCallback />
    },
    {
      path: '/signout',
      element: <Signout />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/app/social',
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'streams',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense fallback={<ChatSkeleton />}>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense fallback={<PhotoSkeleton />}>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'videos',
          element: (
            <Suspense fallback={<VideoSkeleton />}>
              <Videos />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notification />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense fallback={<ProfileSkeleton />}>
              <Profile />
            </Suspense>
          )
        },
        {
          path: 'flashcards',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Cards />
            </Suspense>
          )
        },
        {
          path: 'flashcards/practice',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <PracticeMode />
            </Suspense>
          )
        },
        {
          path: 'flashcards/bookmarks',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Bookmarks />
            </Suspense>
          )
        },
        {
          path: 'flashcards/my-decks',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <MyDecks />
            </Suspense>
          )
        },
        {
          path: 'flashcards/deck/:deckId',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <DeckDetail />
            </Suspense>
          )
        },
        {
          path: 'flashcards/practice/deck/:deckId',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <DeckPractice />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/app/game',
      element: (
        <ProtectedRoute>
          <GameSection />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '',
          element: <GameHome />
        },
        {
          path: 'track/:category',
          element: <Track />
        },
        {
          path: ':levelId',
          element: <Game />
        },
        {
          path: 'complete/:levelId',
          element: <LevelComplete />
        }
      ]
    },
    {
      path: '/css-selectors',
      element: <SelectorAcademy />
    },
    {
      path: '*',
      element: <Error />
    }
  ]);

  return elements;
};
