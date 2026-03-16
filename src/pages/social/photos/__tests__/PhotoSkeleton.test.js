import { render, screen } from '@testing-library/react';
import PhotoSkeleton from '../PhotoSkeleton';

describe('PhotoSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<PhotoSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the Photos heading text', () => {
    render(<PhotoSkeleton />);
    expect(screen.getByText('Photos')).toBeInTheDocument();
  });

  it('renders the gallery-images container', () => {
    const { container } = render(<PhotoSkeleton />);
    expect(container.querySelector('.gallery-images')).toBeInTheDocument();
  });
});
