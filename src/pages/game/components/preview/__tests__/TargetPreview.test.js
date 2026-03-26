import { render, screen } from '@testing-library/react';
import { TargetPreview } from '../TargetPreview';

describe('TargetPreview', () => {
  // ── URL stripping ─────────────────────────────────────────────────────────

  it('strips the localhost host from the iframe src', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-01/" levelTitle="The First Test" />);
    const iframe = screen.getByTitle('Target: The First Test');
    expect(iframe).toHaveAttribute('src', '/pages/level-01/');
  });

  it('strips localhost with any port number', () => {
    render(<TargetPreview targetUrl="http://localhost:3000/pages/level-77/" levelTitle="Level 77" />);
    const iframe = screen.getByTitle('Target: Level 77');
    expect(iframe).toHaveAttribute('src', '/pages/level-77/');
  });

  it('strips https:// localhost as well', () => {
    render(<TargetPreview targetUrl="https://localhost:8080/pages/level-10/" levelTitle="Level 10" />);
    const iframe = screen.getByTitle('Target: Level 10');
    expect(iframe).toHaveAttribute('src', '/pages/level-10/');
  });

  // ── Iframe attributes ─────────────────────────────────────────────────────

  it('renders an iframe with the correct title', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-01/" levelTitle="Selector Basics" />);
    expect(screen.getByTitle('Target: Selector Basics')).toBeInTheDocument();
  });

  it('applies sandbox restrictions to the iframe', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-01/" levelTitle="Level 01" />);
    const iframe = screen.getByTitle('Target: Level 01');
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
  });

  // ── Preview header ────────────────────────────────────────────────────────

  it('renders the target icon', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-01/" levelTitle="Level 01" />);
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('renders the level title in the preview header', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-01/" levelTitle="The Selector Sage" />);
    expect(screen.getByText(/Target Page — The Selector Sage/)).toBeInTheDocument();
  });

  // ── Open in new tab link ──────────────────────────────────────────────────

  it('renders an open-in-new-tab link', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-01/" levelTitle="Level 01" />);
    const link = screen.getByTitle('Open in new tab');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('open-in-new-tab link href uses the stripped path', () => {
    render(<TargetPreview targetUrl="http://localhost:5000/pages/level-42/" levelTitle="Level 42" />);
    const link = screen.getByTitle('Open in new tab');
    expect(link).toHaveAttribute('href', '/pages/level-42/');
  });
});
