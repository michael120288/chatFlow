import { render, screen } from '@testing-library/react';
import NotificationSkeleton from '../NotificationSkeleton';

describe('NotificationSkeleton', () => {
  it('renders without crashing', () => {
    render(<NotificationSkeleton />);
    expect(screen.getByTestId('notification-skeleton')).toBeInTheDocument();
  });

  it('renders the Notifications heading text', () => {
    render(<NotificationSkeleton />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders 5 notification placeholder items', () => {
    const { container } = render(<NotificationSkeleton />);
    expect(container.querySelectorAll('.notification-box')).toHaveLength(5);
  });
});
