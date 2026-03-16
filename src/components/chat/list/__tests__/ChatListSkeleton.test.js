import { render } from '@testing-library/react';
import ChatListSkeleton from '../ChatListSkeleton';

describe('ChatListSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChatListSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the conversation container', () => {
    const { container } = render(<ChatListSkeleton />);
    expect(container.querySelector('.conversation-container')).toBeInTheDocument();
  });

  it('renders 10 conversation placeholder items', () => {
    const { container } = render(<ChatListSkeleton />);
    expect(container.querySelectorAll('.conversation-item')).toHaveLength(10);
  });
});
