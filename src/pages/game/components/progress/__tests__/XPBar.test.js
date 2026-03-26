import { render, screen } from '@testing-library/react';
import { XPBar } from '../XPBar';

// Mock useProgress so XPBar renders without needing the full GameProvider/Redux stack
jest.mock('../../../hooks/useProgress', () => ({
  useProgress: () => ({
    xp: 750,
    completedLevels: ['cy-01', 'cy-02', 'cy-03'],
    totalLevels: 59
  })
}));

describe('XPBar', () => {
  // ── XP display ────────────────────────────────────────────────────────────

  it('renders the total XP from useProgress', () => {
    render(<XPBar />);
    expect(screen.getByText(/750/)).toBeInTheDocument();
  });

  it('shows the XP label', () => {
    render(<XPBar />);
    expect(screen.getByText('Total earned')).toBeInTheDocument();
  });

  // ── Level counts ──────────────────────────────────────────────────────────

  it('shows completed/total levels from useProgress by default', () => {
    render(<XPBar />);
    expect(screen.getByText('3/59 Levels')).toBeInTheDocument();
  });

  it('shows completedCount override when provided', () => {
    render(<XPBar completedCount={10} />);
    expect(screen.getByText('10/59 Levels')).toBeInTheDocument();
  });

  it('shows totalCount override when provided', () => {
    render(<XPBar totalCount={100} />);
    expect(screen.getByText('3/100 Levels')).toBeInTheDocument();
  });

  it('uses both overrides when both are provided', () => {
    render(<XPBar completedCount={5} totalCount={20} />);
    expect(screen.getByText('5/20 Levels')).toBeInTheDocument();
  });

  // ── Percentage ────────────────────────────────────────────────────────────

  it('calculates percentage based on completed/total', () => {
    // 3/59 = ~5%
    render(<XPBar />);
    const expected = Math.round((3 / 59) * 100);
    expect(screen.getByText(`${expected}% Complete`)).toBeInTheDocument();
  });

  it('shows 100% when completedCount equals totalCount', () => {
    render(<XPBar completedCount={59} totalCount={59} />);
    expect(screen.getByText('100% Complete')).toBeInTheDocument();
  });

  it('shows 0% when completedCount is 0', () => {
    render(<XPBar completedCount={0} totalCount={59} />);
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  // ── XP bar fill ───────────────────────────────────────────────────────────

  it('sets xp bar fill width based on xp % 500', () => {
    // xp=750: 750 % 500 = 250 → 250/500 = 50%
    render(<XPBar />);
    const fill = document.querySelector('.xp-bar-fill');
    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('renders the xp-bar track element', () => {
    render(<XPBar />);
    expect(document.querySelector('.xp-bar-track')).toBeInTheDocument();
  });
});
