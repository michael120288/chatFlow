import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import Error from '@pages/error/Error';
import ProtectedRoute from '@pages/ProtectedRoute';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import CardSkeleton from '@components/card-element/CardSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
import ProfileSkeleton from '@pages/social/profile/ProfileSkeleton';
import ChatSkeleton from '@pages/social/chat/ChatSkeleton';
import VideoSkeleton from '@pages/social/videos/VideoSkeleton';
import PageLoader from '@components/page-loader/PageLoader';

const Home = lazy(() => import('@pages/home').then((m) => ({ default: m.Home })));
const AuthTabs = lazy(() => import('@pages/auth').then((m) => ({ default: m.AuthTabs })));
const ForgotPassword = lazy(() => import('@pages/auth').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('@pages/auth').then((m) => ({ default: m.ResetPassword })));
const SSOCallback = lazy(() => import('@pages/auth/sso/SSOCallback'));
const Signout = lazy(() => import('@pages/auth/signout/Signout'));
const QAPractice = lazy(() => import('@pages/qa-practice').then((m) => ({ default: m.QAPractice })));
const QAPracticeLanding = lazy(() => import('@pages/qa-practice/QAPracticeLanding'));
const GameSection = lazy(() => import('@pages/game/GameSection').then((m) => ({ default: m.GameSection })));
const GameHome = lazy(() => import('@pages/game/GameHome').then((m) => ({ default: m.GameHome })));
const Track = lazy(() => import('@pages/game/Track').then((m) => ({ default: m.Track })));
const Game = lazy(() => import('@pages/game/Game').then((m) => ({ default: m.Game })));
const LevelComplete = lazy(() => import('@pages/game/LevelComplete').then((m) => ({ default: m.LevelComplete })));
const SelectorAcademy = lazy(() =>
  import('@pages/selectors/SelectorAcademy').then((m) => ({ default: m.SelectorAcademy }))
);

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
      element: (
        <Suspense fallback={<PageLoader />}>
          <Home />
        </Suspense>
      )
    },
    {
      path: '/qa-practice',
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPracticeLanding />
            </Suspense>
          )
        },
        {
          path: 'web-inputs',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'dynamic-table',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'drag-and-drop',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'iframe',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'file-upload',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'alerts-modals',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'navigation',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'tooltips',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'loaders',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'accordion',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'tabs',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'carousel',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'search-filters',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'breadcrumbs',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'context-menu',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'copy-clipboard',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'rating',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'wizard',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'infinite-scroll',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'sticky-elements',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'local-storage',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'cookies',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'api-testing',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'form-validation',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'authentication',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'download-files',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'keyboard-nav',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'autocomplete',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'multi-select',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'date-time-picker',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'dark-mode',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'nested-dropdowns',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'error-boundary',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'disabled-readonly',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'progress',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'virtual-scroll',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'websocket',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'credit-card',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'shadow-dom',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'multi-tab',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'viewport',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'rich-text-editor',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'soft-assertions',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'wait-for-request',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        },
        {
          path: 'visual-testing',
          element: (
            <Suspense fallback={<PageLoader />}>
              <QAPractice />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/auth',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AuthTabs />
        </Suspense>
      )
    },
    {
      path: '/sso',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SSOCallback />
        </Suspense>
      )
    },
    {
      path: '/signout',
      element: (
        <Suspense fallback={<PageLoader />}>
          <Signout />
        </Suspense>
      )
    },
    {
      path: '/forgot-password',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ForgotPassword />
        </Suspense>
      )
    },
    {
      path: '/reset-password',
      element: (
        <Suspense fallback={<PageLoader />}>
          <ResetPassword />
        </Suspense>
      )
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
          <Suspense fallback={<PageLoader />}>
            <GameSection />
          </Suspense>
        </ProtectedRoute>
      ),
      children: [
        {
          path: '',
          element: (
            <Suspense fallback={<PageLoader />}>
              <GameHome />
            </Suspense>
          )
        },
        {
          path: 'track/:category',
          element: (
            <Suspense fallback={<PageLoader />}>
              <Track />
            </Suspense>
          )
        },
        {
          path: ':levelId',
          element: (
            <Suspense fallback={<PageLoader />}>
              <Game />
            </Suspense>
          )
        },
        {
          path: 'complete/:levelId',
          element: (
            <Suspense fallback={<PageLoader />}>
              <LevelComplete />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/css-selectors',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SelectorAcademy />
        </Suspense>
      )
    },
    {
      path: '*',
      element: <Error />
    }
  ]);

  return elements;
};
