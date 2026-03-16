import { render, screen } from '@testing-library/react';
import { ResultPanel } from '../ResultPanel';

const PASS_RESULT = {
  passed: true,
  message: 'Level complete! You earned 150 XP!',
  xpAwarded: 150,
  stdout: 'All specs passed!',
  stderr: '',
  exitCode: 0,
};

const FAIL_RESULT = {
  passed: false,
  message: 'Not quite right. Check your code and try again.',
  xpAwarded: 0,
  stdout: '1 failing',
  stderr: 'AssertionError: expected false to equal true',
  exitCode: 1,
};

describe('ResultPanel', () => {
  // ── Loading state ─────────────────────────────────────────────────────────

  it('shows spinner and loading text when loading', () => {
    render(<ResultPanel loading={true} result={null} error={null} />);
    expect(screen.getByText('Running your code in sandbox...')).toBeInTheDocument();
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

  it('shows Docker/Playwright sub-text when loading', () => {
    render(<ResultPanel loading={true} result={null} error={null} />);
    expect(screen.getByText(/Docker container/)).toBeInTheDocument();
  });

  it('does not show result content while loading', () => {
    render(<ResultPanel loading={true} result={PASS_RESULT} error={null} />);
    expect(screen.queryByText('✓ LEVEL PASSED')).not.toBeInTheDocument();
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it('shows error badge and message when error is provided', () => {
    render(<ResultPanel loading={false} result={null} error="Network timeout" />);
    expect(screen.getByText('⚠ Error')).toBeInTheDocument();
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
  });

  it('does not show result content when error is present', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error="Something went wrong" />);
    expect(screen.queryByText('✓ LEVEL PASSED')).not.toBeInTheDocument();
    expect(screen.getByText('⚠ Error')).toBeInTheDocument();
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it('shows prompt when no result, no loading, no error', () => {
    render(<ResultPanel loading={false} result={null} error={null} />);
    expect(screen.getByText(/Write your code above/)).toBeInTheDocument();
    expect(screen.getByText('Run Code')).toBeInTheDocument();
    expect(screen.getByText('▶')).toBeInTheDocument();
  });

  // ── Pass result ───────────────────────────────────────────────────────────

  it('shows LEVEL PASSED badge on pass', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error={null} />);
    expect(screen.getByText('✓ LEVEL PASSED')).toBeInTheDocument();
  });

  it('shows the result message on pass', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error={null} />);
    expect(screen.getByText('Level complete! You earned 150 XP!')).toBeInTheDocument();
  });

  it('shows XP award on pass when xpAwarded > 0', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error={null} />);
    expect(screen.getByText('+150 XP')).toBeInTheDocument();
  });

  it('does not show XP award when xpAwarded is 0', () => {
    render(<ResultPanel loading={false} result={{ ...PASS_RESULT, xpAwarded: 0 }} error={null} />);
    expect(screen.queryByText(/\+0 XP/)).not.toBeInTheDocument();
  });

  it('shows stdout block when stdout is present', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error={null} />);
    expect(screen.getByText('stdout')).toBeInTheDocument();
    expect(screen.getByText('All specs passed!')).toBeInTheDocument();
  });

  it('does not show stdout block when stdout is empty', () => {
    render(<ResultPanel loading={false} result={{ ...PASS_RESULT, stdout: '' }} error={null} />);
    expect(screen.queryByText('stdout')).not.toBeInTheDocument();
  });

  // ── Fail result ───────────────────────────────────────────────────────────

  it('shows Not Quite Right badge on fail', () => {
    render(<ResultPanel loading={false} result={FAIL_RESULT} error={null} />);
    expect(screen.getByText('✗ Not Quite Right')).toBeInTheDocument();
  });

  it('does not show XP award on fail', () => {
    render(<ResultPanel loading={false} result={FAIL_RESULT} error={null} />);
    expect(screen.queryByText(/\+.*XP/)).not.toBeInTheDocument();
  });

  it('shows stderr block when stderr is present', () => {
    render(<ResultPanel loading={false} result={FAIL_RESULT} error={null} />);
    expect(screen.getByText('stderr')).toBeInTheDocument();
    expect(screen.getByText('AssertionError: expected false to equal true')).toBeInTheDocument();
  });

  it('does not show stderr block when stderr is empty', () => {
    render(<ResultPanel loading={false} result={{ ...FAIL_RESULT, stderr: '' }} error={null} />);
    expect(screen.queryByText('stderr')).not.toBeInTheDocument();
  });

  it('shows fail message', () => {
    render(<ResultPanel loading={false} result={FAIL_RESULT} error={null} />);
    expect(screen.getByText('Not quite right. Check your code and try again.')).toBeInTheDocument();
  });

  // ── Exit code ─────────────────────────────────────────────────────────────

  it('shows exit code on pass', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error={null} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows exit code on fail', () => {
    render(<ResultPanel loading={false} result={FAIL_RESULT} error={null} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // ── Screenshot ────────────────────────────────────────────────────────────

  it('shows screenshot image when screenshotBase64 is present', () => {
    const withScreenshot = { ...PASS_RESULT, screenshotBase64: 'abc123' };
    render(<ResultPanel loading={false} result={withScreenshot} error={null} />);
    const img = screen.getByAltText('Test screenshot');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc123');
  });

  it('does not show screenshot section when screenshotBase64 is absent', () => {
    render(<ResultPanel loading={false} result={PASS_RESULT} error={null} />);
    expect(screen.queryByAltText('Test screenshot')).not.toBeInTheDocument();
  });
});
