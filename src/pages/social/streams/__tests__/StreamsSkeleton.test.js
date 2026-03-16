import { render, screen } from '@testing-library/react';
import StreamsSkeleton from '../StreamsSkeleton';

describe('StreamsSkeleton', () => {
  it('renders without crashing', () => {
    render(<StreamsSkeleton />);
    expect(screen.getByTestId('streams')).toBeInTheDocument();
  });

  it('renders the post form skeleton', () => {
    render(<StreamsSkeleton />);
    expect(screen.getByTestId('post-form-skeleton')).toBeInTheDocument();
  });

  it('renders 6 post skeletons', () => {
    render(<StreamsSkeleton />);
    expect(screen.getAllByTestId('posts-skeleton')).toHaveLength(6);
  });

  it('renders the suggestions skeleton', () => {
    render(<StreamsSkeleton />);
    expect(screen.getByTestId('suggestions')).toBeInTheDocument();
  });
});
