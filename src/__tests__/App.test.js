import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import App from '../App';

// Prevent socket.io from trying to connect in tests
jest.mock('@services/socket/socket.service', () => ({
  socketService: { setupSocketConnection: jest.fn() }
}));

// Prevent lazy-loaded pages from failing in jsdom
jest.mock('@root/routes', () => ({
  AppRouter: () => <div data-testid="app-router">Router</div>
}));

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('does not call socketService.setupSocketConnection on mount without a token', () => {
    const { socketService } = require('@services/socket/socket.service');
    renderApp();
    expect(socketService.setupSocketConnection).toHaveBeenCalledTimes(0);
  });

  it('does not render Toast when there are no notifications', () => {
    renderApp();
    // Toast only renders when notifications.length > 0; default store has none
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
