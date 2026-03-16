import { render } from '@testing-library/react';
import ChatSkeleton from '../ChatSkeleton';

describe('ChatSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChatSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the private-chat-wrapper', () => {
    const { container } = render(<ChatSkeleton />);
    expect(container.querySelector('.private-chat-wrapper')).toBeInTheDocument();
  });

  it('renders the conversation list side', () => {
    const { container } = render(<ChatSkeleton />);
    expect(container.querySelector('.conversation-container')).toBeInTheDocument();
  });

  it('renders the message-loading spinner area', () => {
    const { container } = render(<ChatSkeleton />);
    expect(container.querySelector('.message-loading')).toBeInTheDocument();
  });
});
