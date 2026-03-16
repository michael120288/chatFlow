import { render, screen } from '@testing-library/react';
import ProfileSkeleton from '../ProfileSkeleton';

describe('ProfileSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProfileSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the profile banner skeleton', () => {
    render(<ProfileSkeleton />);
    expect(screen.getByTestId('profile-banner-skeleton')).toBeInTheDocument();
  });

  it('renders the post form skeleton', () => {
    render(<ProfileSkeleton />);
    expect(screen.getByTestId('post-form-skeleton')).toBeInTheDocument();
  });

  it('renders 5 post skeleton placeholders', () => {
    render(<ProfileSkeleton />);
    expect(screen.getAllByTestId('posts-skeleton')).toHaveLength(5);
  });
});
