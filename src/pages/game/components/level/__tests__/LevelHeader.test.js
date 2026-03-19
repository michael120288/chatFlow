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

  it('always links to the track page, regardless of level order', () => {
    render(<LevelHeader level={LEVEL} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/cypress-ui');
  });

  it('links to the track page on the first level', () => {
    render(<LevelHeader level={{ ...LEVEL, order: 1 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/cypress-ui');
  });

  it('links to the jest track for jest- prefixed levels', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'jest-08', order: 8, category: 'jest' }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/jest');
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

  // ── High order numbers ────────────────────────────────────────────────────

  it('links to the track page for high order cypress levels', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'cy-80', order: 80 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/cypress-ui');
  });

  it('links to the track page for order 84', () => {
    render(<LevelHeader level={{ ...LEVEL, id: 'cy-84', order: 84 }} />);
    const backEl = screen.getByText(/← Back to Track/);
    expect(backEl.closest('a')).toHaveAttribute('href', '/app/game/track/cypress-ui');
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
