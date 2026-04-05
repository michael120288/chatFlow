import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Game } from '../Game';

import { useLevel } from '../hooks/useLevel';
import { useSubmission } from '../hooks/useSubmission';
import { useLevelNavigation } from '../hooks/useLevelNavigation';
import { useGame } from '../context/GameContext';

// ── Mocks ──────────────────────────────────────────────────────────────────────

jest.mock('../hooks/useLevel');
jest.mock('../hooks/useSubmission');
jest.mock('../hooks/useLevelNavigation');
jest.mock('../context/GameContext');
jest.mock('../components/editor/EditorToolbar', () => ({
  EditorToolbar: ({ onRun, onReset, loading }) => (
    <div data-testid="editor-toolbar">
      <button onClick={onRun} disabled={loading}>
        Run
      </button>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}));
jest.mock('../components/preview/TargetPreview', () => ({
  TargetPreview: ({ targetUrl }) => <div data-testid="target-preview">{targetUrl}</div>
}));
jest.mock('../components/result/ResultPanel', () => ({
  ResultPanel: ({ result, loading }) => (
    <div data-testid="result-panel">{loading ? 'running…' : result?.passed ? 'PASSED' : ''}</div>
  )
}));
jest.mock('../components/level/LevelHeader', () => ({
  LevelHeader: ({ level }) => <div data-testid="level-header">{level?.title}</div>
}));
jest.mock('../components/editor/CodeEditor', () => ({
  CodeEditor: ({ value, onChange }) => (
    <textarea data-testid="code-editor" value={value} onChange={(e) => onChange(e.target.value)} />
  )
}));

const mockSubmit = jest.fn();
const mockReset = jest.fn();

const LEVEL = {
  id: 'jest-01',
  title: 'Hello Jest',
  category: 'jest',
  starterCode: 'test("hello", () => {})',
  hints: [],
  targetUrl: null,
  tool: 'jest',
  order: 1
};

const defaultSubmission = {
  result: null,
  loading: false,
  error: null,
  submit: mockSubmit,
  reset: mockReset
};

function renderGame(levelId = 'jest-01') {
  return render(
    <MemoryRouter initialEntries={[`/app/game/${levelId}`]}>
      <Routes>
        <Route path="/app/game/:levelId" element={<Game />} />
        <Route path="/app/game/complete/:levelId" element={<div>Complete!</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Game', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGame.mockReturnValue({ solutions: {} });
    useLevelNavigation.mockReturnValue({ prevId: null, nextId: 'jest-02' });
    useSubmission.mockReturnValue(defaultSubmission);
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it('shows loading spinner while level is loading', () => {
    useLevel.mockReturnValue({ level: null, loading: true, error: null });
    renderGame();
    expect(screen.getByText('Loading level...')).toBeInTheDocument();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it('shows error message when level fails to load', () => {
    useLevel.mockReturnValue({ level: null, loading: false, error: 'Not found' });
    renderGame();
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('shows fallback error when level is null with no error', () => {
    useLevel.mockReturnValue({ level: null, loading: false, error: null });
    renderGame();
    expect(screen.getByText('Level not found')).toBeInTheDocument();
  });

  // ── Normal render ──────────────────────────────────────────────────────────

  it('renders LevelHeader with level title', () => {
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    expect(screen.getByTestId('level-header')).toHaveTextContent('Hello Jest');
  });

  it('renders the code editor with starter code', () => {
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    expect(screen.getByTestId('code-editor')).toHaveValue('test("hello", () => {})');
  });

  it('loads a saved solution from context when available', () => {
    useGame.mockReturnValue({ solutions: { 'jest-01': 'test("saved", () => {})' } });
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    expect(screen.getByTestId('code-editor')).toHaveValue('test("saved", () => {})');
  });

  it('shows NoTargetPlaceholder when level has no targetUrl', () => {
    useLevel.mockReturnValue({ level: { ...LEVEL, targetUrl: null }, loading: false, error: null });
    renderGame();
    expect(screen.queryByTestId('target-preview')).not.toBeInTheDocument();
    // placeholder is rendered
    expect(screen.getByText('No Target Page')).toBeInTheDocument();
  });

  it('shows TargetPreview when level has a targetUrl', () => {
    useLevel.mockReturnValue({
      level: { ...LEVEL, targetUrl: 'http://localhost:3001' },
      loading: false,
      error: null
    });
    renderGame();
    expect(screen.getByTestId('target-preview')).toBeInTheDocument();
  });

  it('shows cypress-component meta for cypress-component tool', () => {
    useLevel.mockReturnValue({
      level: { ...LEVEL, tool: 'cypress-component', targetUrl: null },
      loading: false,
      error: null
    });
    renderGame();
    expect(screen.getByText('Component Test')).toBeInTheDocument();
  });

  // ── Run button ─────────────────────────────────────────────────────────────

  it('calls submit when Run is clicked', async () => {
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    await userEvent.click(screen.getByText('Run'));
    expect(mockSubmit).toHaveBeenCalledWith('jest-01', 'test("hello", () => {})', 'jest');
  });

  it('disables Run button while submitting', () => {
    useSubmission.mockReturnValue({ ...defaultSubmission, loading: true });
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    expect(screen.getByText('Run')).toBeDisabled();
  });

  // ── Reset button ───────────────────────────────────────────────────────────

  it('resets code to starterCode when Reset is clicked', async () => {
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    const editor = screen.getByTestId('code-editor');
    await userEvent.clear(editor);
    await userEvent.type(editor, 'changed code');
    await userEvent.click(screen.getByText('Reset'));
    expect(mockReset).toHaveBeenCalled();
  });

  // ── Result panel ───────────────────────────────────────────────────────────

  it('shows PASSED in result panel when result is passed', () => {
    useSubmission.mockReturnValue({ ...defaultSubmission, result: { passed: true } });
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    expect(screen.getByTestId('result-panel')).toHaveTextContent('PASSED');
  });

  // ── Keyboard shortcut ──────────────────────────────────────────────────────

  it('triggers run on Ctrl+Enter', async () => {
    useLevel.mockReturnValue({ level: LEVEL, loading: false, error: null });
    renderGame();
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    expect(mockSubmit).toHaveBeenCalled();
  });
});
