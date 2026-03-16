import { render, screen } from '@testing-library/react';
import BackgroundHeaderSkeleton from '../BackgroundHeaderSkeleton';

const tabItems = [
  { key: 'Timeline', show: true },
  { key: 'Followers', show: true },
  { key: 'Gallery', show: false },
];

describe('BackgroundHeaderSkeleton', () => {
  it('renders without crashing', () => {
    render(<BackgroundHeaderSkeleton tabItems={tabItems} />);
    expect(screen.getByTestId('profile-banner-skeleton')).toBeInTheDocument();
  });

  it('renders the profile banner', () => {
    const { container } = render(<BackgroundHeaderSkeleton tabItems={tabItems} />);
    expect(container.querySelector('.profile-banner')).toBeInTheDocument();
  });

  it('renders only visible tab items (show: true)', () => {
    const { container } = render(<BackgroundHeaderSkeleton tabItems={tabItems} />);
    // 2 visible items (Timeline, Followers); Gallery has show: false
    expect(container.querySelectorAll('.banner-nav-item')).toHaveLength(2);
  });

  it('renders with an empty tabItems array', () => {
    render(<BackgroundHeaderSkeleton tabItems={[]} />);
    expect(screen.getByTestId('profile-banner-skeleton')).toBeInTheDocument();
  });
});
