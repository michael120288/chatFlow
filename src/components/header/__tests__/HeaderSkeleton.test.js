import { render, screen } from '@testing-library/react';
import HeaderSkeleton from '../HeaderSkeleton';

describe('HeaderSkeleton', () => {
  it('renders without crashing', () => {
    render(<HeaderSkeleton />);
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument();
  });

  it('renders the header-nav-wrapper', () => {
    const { container } = render(<HeaderSkeleton />);
    expect(container.querySelector('.header-nav-wrapper')).toBeInTheDocument();
  });

  it('renders the header navigation list', () => {
    const { container } = render(<HeaderSkeleton />);
    expect(container.querySelector('.header-nav')).toBeInTheDocument();
  });
});
