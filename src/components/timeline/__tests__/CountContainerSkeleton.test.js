import { render, screen } from '@testing-library/react';
import CountContainerSkeleton from '../CountContainerSkeleton';

describe('CountContainerSkeleton', () => {
  it('renders without crashing', () => {
    render(<CountContainerSkeleton />);
    expect(screen.getByTestId('count-container-skeleton')).toBeInTheDocument();
  });

  it('renders the followers-count section', () => {
    const { container } = render(<CountContainerSkeleton />);
    expect(container.querySelector('.followers-count')).toBeInTheDocument();
  });

  it('renders the following-count section', () => {
    const { container } = render(<CountContainerSkeleton />);
    expect(container.querySelector('.following-count')).toBeInTheDocument();
  });
});
