import { render, screen } from '@testing-library/react';
import VideoSkeleton from '../VideoSkeleton';

describe('VideoSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the Videos heading text', () => {
    render(<VideoSkeleton />);
    expect(screen.getByText('Videos')).toBeInTheDocument();
  });

  it('renders the gallery-videos container', () => {
    const { container } = render(<VideoSkeleton />);
    expect(container.querySelector('.gallery-videos')).toBeInTheDocument();
  });
});
