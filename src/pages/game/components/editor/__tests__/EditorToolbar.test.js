import { render, screen, fireEvent } from '@testing-library/react';
import { EditorToolbar } from '../EditorToolbar';

const HINTS = ['First hint text', 'Second hint text', 'Third hint text'];

function renderToolbar(props = {}) {
  const defaults = {
    onRun: jest.fn(),
    onReset: jest.fn(),
    hints: HINTS,
    loading: false,
    showingSolution: false,
  };
  return render(<EditorToolbar {...defaults} {...props} />);
}

describe('EditorToolbar', () => {
  // ── Run button ──────────────────────────────────────────────────────────

  it('renders the Run Code button', () => {
    renderToolbar();
    expect(screen.getByText(/Run Code/)).toBeInTheDocument();
  });

  it('calls onRun when Run Code is clicked', () => {
    const onRun = jest.fn();
    renderToolbar({ onRun });
    fireEvent.click(screen.getByText(/Run Code/));
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('shows "Running..." and disables the Run button while loading', () => {
    renderToolbar({ loading: true });
    const btn = screen.getByTitle('Run your code');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Running...');
  });

  it('Re-enables Run button when loading is false', () => {
    renderToolbar({ loading: false });
    expect(screen.getByTitle('Run your code')).not.toBeDisabled();
  });

  // ── Reset button ────────────────────────────────────────────────────────

  it('renders "↺ Reset" when showingSolution is false', () => {
    renderToolbar({ showingSolution: false });
    expect(screen.getByTitle('Reset to starter code')).toHaveTextContent('↺ Reset');
  });

  it('renders "↺ Reset to Starter" when showingSolution is true', () => {
    renderToolbar({ showingSolution: true });
    expect(screen.getByTitle('Reset to starter code')).toHaveTextContent('↺ Reset to Starter');
  });

  it('calls onReset when Reset button is clicked', () => {
    const onReset = jest.fn();
    renderToolbar({ onReset });
    fireEvent.click(screen.getByTitle('Reset to starter code'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  // ── Solution badge ──────────────────────────────────────────────────────

  it('shows solution badge when showingSolution is true', () => {
    renderToolbar({ showingSolution: true });
    expect(screen.getByText('✓ Your solution')).toBeInTheDocument();
  });

  it('does not show solution badge when showingSolution is false', () => {
    renderToolbar({ showingSolution: false });
    expect(screen.queryByText('✓ Your solution')).not.toBeInTheDocument();
  });

  // ── Hint button — no hints ──────────────────────────────────────────────

  it('does not render a Hint button when hints array is empty', () => {
    renderToolbar({ hints: [] });
    expect(screen.queryByText(/Hint/)).not.toBeInTheDocument();
  });

  // ── Hint button — cycling ───────────────────────────────────────────────

  it('renders "💡 Hint" button when hints are provided', () => {
    renderToolbar();
    expect(screen.getByText('💡 Hint')).toBeInTheDocument();
  });

  it('shows the first hint after clicking Hint', () => {
    renderToolbar();
    fireEvent.click(screen.getByText('💡 Hint'));
    expect(screen.getByText('First hint text')).toBeInTheDocument();
    expect(screen.getByText('Hint 1 of 3')).toBeInTheDocument();
  });

  it('button changes to "Next Hint" after first hint is shown', () => {
    renderToolbar();
    fireEvent.click(screen.getByText('💡 Hint'));
    expect(screen.getByText('💡 Next Hint')).toBeInTheDocument();
  });

  it('cycles to the second hint on next click', () => {
    renderToolbar();
    fireEvent.click(screen.getByText('💡 Hint'));
    fireEvent.click(screen.getByText('💡 Next Hint'));
    expect(screen.getByText('Second hint text')).toBeInTheDocument();
    expect(screen.getByText('Hint 2 of 3')).toBeInTheDocument();
  });

  it('shows "Hide Hints" on the last hint', () => {
    renderToolbar();
    fireEvent.click(screen.getByText('💡 Hint'));
    fireEvent.click(screen.getByText('💡 Next Hint'));
    fireEvent.click(screen.getByText('💡 Next Hint'));
    expect(screen.getByText('💡 Hide Hints')).toBeInTheDocument();
    expect(screen.getByText('Third hint text')).toBeInTheDocument();
  });

  it('hides hints after clicking Hide Hints', () => {
    renderToolbar();
    fireEvent.click(screen.getByText('💡 Hint'));
    fireEvent.click(screen.getByText('💡 Next Hint'));
    fireEvent.click(screen.getByText('💡 Next Hint'));
    fireEvent.click(screen.getByText('💡 Hide Hints'));
    expect(screen.queryByText('First hint text')).not.toBeInTheDocument();
    expect(screen.getByText('💡 Hint')).toBeInTheDocument(); // resets to start
  });

  it('works correctly with a single hint', () => {
    renderToolbar({ hints: ['Only hint'] });
    fireEvent.click(screen.getByText('💡 Hint'));
    expect(screen.getByText('Only hint')).toBeInTheDocument();
    expect(screen.getByText('Hint 1 of 1')).toBeInTheDocument();
    expect(screen.getByText('💡 Hide Hints')).toBeInTheDocument();
  });
});
