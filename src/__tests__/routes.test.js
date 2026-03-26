import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import { AppRouter } from '../routes';

// Mock all page components
jest.mock('@pages/auth', () => ({
  AuthTabs: () => <div data-testid="auth-tabs">AuthTabs</div>,
  ForgotPassword: () => <div data-testid="forgot-password">ForgotPassword</div>,
  ResetPassword: () => <div data-testid="reset-password">ResetPassword</div>
}));
jest.mock('@pages/home', () => ({ Home: () => <div data-testid="home">Home</div> }));
jest.mock('@pages/auth/sso/SSOCallback', () => ({
  __esModule: true,
  default: () => <div data-testid="sso-callback">SSOCallback</div>
}));
jest.mock('@pages/auth/signout/Signout', () => ({
  __esModule: true,
  default: () => <div data-testid="signout">Signout</div>
}));
jest.mock('@pages/qa-practice', () => ({ QAPractice: () => <div data-testid="qa-practice">QAPractice</div> }));
jest.mock('@pages/qa-practice/QAPracticeLanding', () => ({
  __esModule: true,
  default: () => <div data-testid="qa-practice">QAPracticeLanding</div>
}));
jest.mock('@pages/error/Error', () => ({ __esModule: true, default: () => <div data-testid="error-page">Error</div> }));
jest.mock('@pages/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="protected-route">{children}</div>
}));
jest.mock('@pages/game/GameSection', () => ({ GameSection: () => <div data-testid="game-section">GameSection</div> }));
jest.mock('@pages/game/GameHome', () => ({ GameHome: () => <div data-testid="game-home">GameHome</div> }));
jest.mock('@pages/game/Track', () => ({ Track: () => <div data-testid="track">Track</div> }));
jest.mock('@pages/game/Game', () => ({ Game: () => <div data-testid="game">Game</div> }));
jest.mock('@pages/game/LevelComplete', () => ({
  LevelComplete: () => <div data-testid="level-complete">LevelComplete</div>
}));

// Mock lazy-loaded social pages
jest.mock('@pages/social/Social', () => ({ __esModule: true, default: () => <div data-testid="social">Social</div> }));
jest.mock('@pages/social/streams/Streams', () => ({
  __esModule: true,
  default: () => <div data-testid="streams">Streams</div>
}));
jest.mock('@pages/social/chat/Chat', () => ({ __esModule: true, default: () => <div data-testid="chat">Chat</div> }));
jest.mock('@pages/social/followers/Followers', () => ({
  __esModule: true,
  default: () => <div data-testid="followers">Followers</div>
}));
jest.mock('@pages/social/following/Following', () => ({
  __esModule: true,
  default: () => <div data-testid="following">Following</div>
}));
jest.mock('@pages/social/notifications/Notification', () => ({
  __esModule: true,
  default: () => <div data-testid="notification">Notification</div>
}));
jest.mock('@pages/social/people/People', () => ({
  __esModule: true,
  default: () => <div data-testid="people">People</div>
}));
jest.mock('@pages/social/photos/Photos', () => ({
  __esModule: true,
  default: () => <div data-testid="photos">Photos</div>
}));
jest.mock('@pages/social/videos/Videos', () => ({
  __esModule: true,
  default: () => <div data-testid="videos">Videos</div>
}));
jest.mock('@pages/social/profile/Profile', () => ({
  __esModule: true,
  default: () => <div data-testid="profile">Profile</div>
}));
jest.mock('@pages/social/flashcards/Cards', () => ({
  __esModule: true,
  default: () => <div data-testid="cards">Cards</div>
}));
jest.mock('@pages/social/flashcards/PracticeMode', () => ({
  __esModule: true,
  default: () => <div data-testid="practice-mode">PracticeMode</div>
}));
jest.mock('@pages/social/flashcards/Bookmarks', () => ({
  __esModule: true,
  default: () => <div data-testid="bookmarks">Bookmarks</div>
}));
jest.mock('@pages/social/flashcards/MyDecks', () => ({
  __esModule: true,
  default: () => <div data-testid="my-decks">MyDecks</div>
}));
jest.mock('@pages/social/flashcards/DeckDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="deck-detail">DeckDetail</div>
}));
jest.mock('@pages/social/flashcards/DeckPractice', () => ({
  __esModule: true,
  default: () => <div data-testid="deck-practice">DeckPractice</div>
}));

// Mock skeleton components
jest.mock('@pages/social/streams/StreamsSkeleton', () => ({
  __esModule: true,
  default: () => <div>StreamsSkeleton</div>
}));
jest.mock('@pages/social/notifications/NotificationSkeleton', () => ({
  __esModule: true,
  default: () => <div>NotificationSkeleton</div>
}));
jest.mock('@components/card-element/CardSkeleton', () => ({
  __esModule: true,
  default: () => <div>CardSkeleton</div>
}));
jest.mock('@pages/social/photos/PhotoSkeleton', () => ({ __esModule: true, default: () => <div>PhotoSkeleton</div> }));
jest.mock('@pages/social/profile/ProfileSkeleton', () => ({
  __esModule: true,
  default: () => <div>ProfileSkeleton</div>
}));
jest.mock('@pages/social/chat/ChatSkeleton', () => ({ __esModule: true, default: () => <div>ChatSkeleton</div> }));
jest.mock('@pages/social/videos/VideoSkeleton', () => ({ __esModule: true, default: () => <div>VideoSkeleton</div> }));

const renderAt = (path) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={<div data-testid="suspense-fallback">Loading</div>}>
          <AppRouter />
        </Suspense>
      </MemoryRouter>
    </Provider>
  );

describe('AppRouter', () => {
  it('renders Home at /', () => {
    renderAt('/');
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('renders AuthTabs at /auth', () => {
    renderAt('/auth');
    expect(screen.getByTestId('auth-tabs')).toBeInTheDocument();
  });

  it('renders ForgotPassword at /forgot-password', () => {
    renderAt('/forgot-password');
    expect(screen.getByTestId('forgot-password')).toBeInTheDocument();
  });

  it('renders ResetPassword at /reset-password', () => {
    renderAt('/reset-password');
    expect(screen.getByTestId('reset-password')).toBeInTheDocument();
  });

  it('renders SSOCallback at /sso', () => {
    renderAt('/sso');
    expect(screen.getByTestId('sso-callback')).toBeInTheDocument();
  });

  it('renders Signout at /signout', () => {
    renderAt('/signout');
    expect(screen.getByTestId('signout')).toBeInTheDocument();
  });

  it('renders QAPractice at /qa-practice', () => {
    renderAt('/qa-practice');
    expect(screen.getByTestId('qa-practice')).toBeInTheDocument();
  });

  it('renders Error page for unknown routes', () => {
    renderAt('/this-does-not-exist');
    expect(screen.getByTestId('error-page')).toBeInTheDocument();
  });

  it('wraps /app/social in ProtectedRoute', async () => {
    renderAt('/app/social');
    await waitFor(() => expect(screen.getByTestId('protected-route')).toBeInTheDocument());
  });

  it('wraps /app/game in ProtectedRoute', () => {
    renderAt('/app/game');
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });
});
