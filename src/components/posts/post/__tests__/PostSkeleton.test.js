import { render, screen } from '@testing-library/react';
import PostSkeleton from '../PostSkeleton';

describe('PostSkeleton', () => {
  it('renders without crashing', () => {
    render(<PostSkeleton />);
    expect(screen.getByTestId('posts-skeleton')).toBeInTheDocument();
  });

  it('renders the post-body container', () => {
    const { container } = render(<PostSkeleton />);
    expect(container.querySelector('.post-body')).toBeInTheDocument();
  });

  it('renders the user post data section', () => {
    const { container } = render(<PostSkeleton />);
    expect(container.querySelector('.user-post-data')).toBeInTheDocument();
  });
});
