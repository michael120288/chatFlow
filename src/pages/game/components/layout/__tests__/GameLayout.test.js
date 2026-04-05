import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { GameLayout } from '../GameLayout';
import { useProgress } from '../../../hooks/useProgress';

jest.mock('../../../hooks/useProgress');

const defaultProgress = {
  trackXP: { playwright: 0, 'cypress-ui': 0, jest: 0 },
  completedLevels: [],
  totalLevels: 59
};

function makeStore(profile = null) {
  return configureStore({ reducer: { user: () => ({ profile }) } });
}

function renderLayout(path = '/app/game', profile = null) {
  return render(
    <Provider store={makeStore(profile)}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/app/game/*" element={<GameLayout />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('GameLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgress.mockReturnValue(defaultProgress);
  });

  // ── Brand ─────────────────────────────────────────────────────────────────

  it('renders the Test Quest brand link', () => {
    renderLayout();
    expect(screen.getByText('Test Quest')).toBeInTheDocument();
  });

  it('brand link points to /app/game', () => {
    renderLayout();
    expect(screen.getByText('Test Quest').closest('a')).toHaveAttribute('href', '/app/game');
  });

  // ── Level Map link ─────────────────────────────────────────────────────────

  it('does not show Level Map link on the game home page', () => {
    renderLayout('/app/game');
    expect(screen.queryByText('Level Map')).not.toBeInTheDocument();
  });

  it('shows Level Map link on non-home game pages', () => {
    renderLayout('/app/game/jest-01');
    expect(screen.getByText('Level Map')).toBeInTheDocument();
  });

  // ── XP chips ──────────────────────────────────────────────────────────────

  it('shows Playwright XP chip', () => {
    useProgress.mockReturnValue({ ...defaultProgress, trackXP: { playwright: 1500, 'cypress-ui': 0, jest: 0 } });
    renderLayout();
    expect(screen.getByText('1,500 XP')).toBeInTheDocument();
  });

  it('shows Cypress XP chip', () => {
    useProgress.mockReturnValue({ ...defaultProgress, trackXP: { playwright: 0, 'cypress-ui': 800, jest: 0 } });
    renderLayout();
    expect(screen.getByText('800 XP')).toBeInTheDocument();
  });

  it('shows Jest XP chip', () => {
    useProgress.mockReturnValue({ ...defaultProgress, trackXP: { playwright: 0, 'cypress-ui': 0, jest: 260 } });
    renderLayout();
    expect(screen.getByText('260 XP')).toBeInTheDocument();
  });

  it('shows 0 XP when no trackXP data', () => {
    renderLayout();
    const xpValues = screen.getAllByText('0 XP');
    expect(xpValues.length).toBe(3);
  });

  // ── Progress chip ──────────────────────────────────────────────────────────

  it('shows completed/total levels', () => {
    useProgress.mockReturnValue({ ...defaultProgress, completedLevels: ['jest-01', 'jest-02'], totalLevels: 59 });
    renderLayout();
    expect(screen.getByText('2/59')).toBeInTheDocument();
  });

  // ── Profile section ────────────────────────────────────────────────────────

  it('does not show avatar when profile is null', () => {
    renderLayout('/app/game', null);
    expect(screen.queryByText(/^[A-Z]$/)).not.toBeInTheDocument();
  });

  it('shows avatar initial when profile is present', () => {
    renderLayout('/app/game', { username: 'Michael', avatarColor: '#ff0000' });
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('shows username when profile is present', () => {
    renderLayout('/app/game', { username: 'Michael', avatarColor: '#ff0000' });
    expect(screen.getByText('Michael')).toBeInTheDocument();
  });

  // ── Home button ────────────────────────────────────────────────────────────

  it('renders the Home button', () => {
    renderLayout();
    expect(screen.getByText('🏠 Home')).toBeInTheDocument();
  });
});
