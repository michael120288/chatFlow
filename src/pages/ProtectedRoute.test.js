import ProtectedRoute from '@pages/ProtectedRoute';
import { clearUser } from '@redux/reducers/user/user.reducer';
import { store } from '@redux/store';
import { userService } from '@services/api/user/user.service';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { existingUser, userJwt } from '@mocks/data/user.mock';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const renderProtectedRoute = (children) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<ProtectedRoute>{children}</ProtectedRoute>} />
          <Route path="/auth" element={<div data-testid="auth-page">Auth</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    store.dispatch(clearUser());
    localStorage.clear();
    sessionStorage.clear();
    mockedUsedNavigate.mockReset();
    jest.spyOn(userService, 'logoutUser').mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('redirects to /auth when no auth state is present', async () => {
    jest.spyOn(userService, 'checkCurrentUser').mockRejectedValue(new Error('Unauthorized'));

    await act(async () => {
      renderProtectedRoute(<div data-testid="children">Protected Content</div>);
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
  });

  it('renders children when keepLoggedIn=true and checkCurrentUser resolves', async () => {
    jest.spyOn(userService, 'checkCurrentUser').mockResolvedValue({
      data: { user: existingUser, token: userJwt }
    });
    localStorage.setItem('keepLoggedIn', JSON.stringify(true));

    await act(async () => {
      renderProtectedRoute(<div data-testid="children">Protected Content</div>);
    });

    await waitFor(() => {
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });
  });

  it('navigates to /auth when checkCurrentUser rejects and keepLoggedIn is set', async () => {
    jest.spyOn(userService, 'checkCurrentUser').mockRejectedValue(new Error('Unauthorized'));
    localStorage.setItem('keepLoggedIn', JSON.stringify(true));

    await act(async () => {
      renderProtectedRoute(<div data-testid="children">Protected Content</div>);
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/auth');
    });
  });
});
