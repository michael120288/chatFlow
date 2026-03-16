import { screen, fireEvent } from '@testing-library/react';
import { render } from '@root/test.utils';
import { LevelHeader } from '../LevelHeader';

const LEVEL = {
  id: 'cy-05',
  order: 5,
  category: 'cypress-ui',
  xpReward: 150,
  tags: ['cy.get', 'assertions', 'selectors'],
  title: 'The Selector Sage',
  story: 'A wizard needs to select elements wisely.',
  objective: 'Use cy.get() to find every element on the page.',
};

describe('LevelHeader', () => {
  // ── Level metadata ────────────────────────────────────────────────────────

  it('renders the level title', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByRole('heading', { name: 'The Selector Sage' })).toBeInTheDocument();
  });

  it('renders the level order number', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByText(/Level 5/)).toBeInTheDocument();
  });

  it('renders the XP reward', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByText('+150 XP')).toBeInTheDocument();
  });

  it('renders all tags', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByText('cy.get')).toBeInTheDocument();
    expect(screen.getByText('assertions')).toBeInTheDocument();
    expect(screen.getByText('selectors')).toBeInTheDocument();
  });

  it('renders the story text', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByText('A wizard needs to select elements wisely.')).toBeInTheDocument();
  });

  it('renders the objective text', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByText('Use cy.get() to find every element on the page.')).toBeInTheDocument();
  });

  it('renders the objective label', () => {
    render(<LevelHeader level={LEVEL} />);
    expect(screen.getByText('🎯 Objective:')).toBeInTheDocument();
  });

  // ── Back navigation ───────────────────────────────────────────────────────

  it('links to the previous level when order > 1', () => {
    render(<LevelHeader level={LEVEL} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/cy-04');
  });

  it('links to the track page when on the first level', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'level-01', order: 1 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/cypress-ui');
  });

  it('works for cy- prefixed ids', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'cy-03', order: 3 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/cy-02');
  });

  // ── Different XP values ───────────────────────────────────────────────────

  it('displays the correct XP for any reward amount', () => {
    render(<LevelHeader level={{ ...LEVEL, xpReward: 550 }} />);
    expect(screen.getByText('+550 XP')).toBeInTheDocument();
  });

  // ── No tags ───────────────────────────────────────────────────────────────

  it('renders nothing for tags when the array is empty', () => {
    render(<LevelHeader level={{ ...LEVEL, tags: [] }} />);
    expect(screen.queryByText('cy.get')).not.toBeInTheDocument();
  });

  // ── High order numbers (network request levels cy-80+) ────────────────────

  it('links to the previous level for order 80 (cy-79, no zero-padding needed)', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'cy-80', order: 80 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/cy-79');
  });

  it('links to the previous level for order 84 (cy-83)', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'cy-84', order: 84 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/cy-83');
  });

  // ── Playwright category remapping ─────────────────────────────────────────

  it('maps ui category to the playwright track when on the first level', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'level-01', order: 1, category: 'ui' }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/playwright');
  });

  it('maps api category to the playwright track when on the first level', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'level-01', order: 1, category: 'api' }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/playwright');
  });
});
