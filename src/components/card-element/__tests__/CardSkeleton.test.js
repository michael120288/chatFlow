import { render, screen } from '@testing-library/react';
import CardSkeleton from '../CardSkeleton';

describe('CardSkeleton', () => {
  it('renders without crashing', () => {
    render(<CardSkeleton />);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });

  it('renders 3 card placeholder items', () => {
    const { container } = render(<CardSkeleton />);
    expect(container.querySelectorAll('.card-element-item')).toHaveLength(3);
  });

  it('renders the card-element wrapper', () => {
    const { container } = render(<CardSkeleton />);
    expect(container.querySelector('.card-element')).toBeInTheDocument();
  });
});
