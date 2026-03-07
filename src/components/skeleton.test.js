import { render, screen } from '../test.utils';
import ChatListSkeleton from '@components/chat/list/ChatListSkeleton';
import SuggestionsSkeletons from '@components/suggestions/SuggestionsSkeleton';
import CardSkeleton from '@components/card-element/CardSkeleton';
import PostSkeleton from '@components/posts/post/PostSkeleton';
import PostFormSkeleton from '@components/posts/post-form/PostFormSkeleton';
import HeaderSkeleton from '@components/header/HeaderSkeleton';
import BasicInfoSkeleton from '@components/timeline/BasicInfoSkeleton';
import CountContainerSkeleton from '@components/timeline/CountContainerSkeleton';
import BackgroundHeaderSkeleton from '@components/background-header/BackgroundHeaderSkeleton';
import PageLoader from '@components/page-loader/PageLoader';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import ProfileSkeleton from '@pages/social/profile/ProfileSkeleton';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import VideoSkeleton from '@pages/social/videos/VideoSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
import ChatSkeleton from '@pages/social/chat/ChatSkeleton';

describe('Skeleton components render without crashing', () => {
  it('renders ChatListSkeleton', () => {
    render(<ChatListSkeleton />);
    expect(document.querySelector('.conversation-container')).toBeInTheDocument();
  });

  it('renders SuggestionsSkeletons', () => {
    render(<SuggestionsSkeletons />);
    expect(screen.getByTestId('suggestions')).toBeInTheDocument();
  });

  it('renders CardSkeleton', () => {
    render(<CardSkeleton />);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });

  it('renders PostSkeleton', () => {
    render(<PostSkeleton />);
    expect(screen.getByTestId('posts-skeleton')).toBeInTheDocument();
  });

  it('renders PostFormSkeleton', () => {
    render(<PostFormSkeleton />);
    expect(screen.getByTestId('post-form-skeleton')).toBeInTheDocument();
  });

  it('renders HeaderSkeleton', () => {
    render(<HeaderSkeleton />);
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument();
  });

  it('renders BasicInfoSkeleton', () => {
    render(<BasicInfoSkeleton />);
    expect(screen.getByTestId('basic-info')).toBeInTheDocument();
  });

  it('renders CountContainerSkeleton', () => {
    render(<CountContainerSkeleton />);
    expect(screen.getByTestId('count-container-skeleton')).toBeInTheDocument();
  });

  it('renders BackgroundHeaderSkeleton with tabItems', () => {
    const tabItems = [
      { key: 'tab1', show: true, text: 'Tab 1' },
      { key: 'tab2', show: false, text: 'Tab 2' }
    ];
    render(<BackgroundHeaderSkeleton tabItems={tabItems} />);
    expect(screen.getByTestId('profile-banner-skeleton')).toBeInTheDocument();
  });

  it('renders BackgroundHeaderSkeleton with empty tabItems', () => {
    render(<BackgroundHeaderSkeleton tabItems={[]} />);
    expect(screen.getByTestId('profile-banner-skeleton')).toBeInTheDocument();
  });

  it('renders PageLoader', () => {
    render(<PageLoader />);
    expect(document.querySelector('.page-loader')).toBeInTheDocument();
  });

  it('renders NotificationSkeleton', () => {
    render(<NotificationSkeleton />);
    expect(screen.getByTestId('notification-skeleton')).toBeInTheDocument();
  });

  it('renders VideoSkeleton', () => {
    render(<VideoSkeleton />);
    expect(document.querySelector('.videos-container')).toBeInTheDocument();
  });

  it('renders PhotoSkeleton', () => {
    render(<PhotoSkeleton />);
    expect(document.querySelector('.photos-container')).toBeInTheDocument();
  });

  it('renders StreamsSkeleton', () => {
    render(<StreamsSkeleton />);
    expect(screen.getByTestId('streams')).toBeInTheDocument();
  });

  it('renders ProfileSkeleton', () => {
    render(<ProfileSkeleton />);
    expect(document.querySelector('.profile-wrapper')).toBeInTheDocument();
  });

  it('renders ChatSkeleton', () => {
    render(<ChatSkeleton />);
    expect(document.querySelector('.private-chat-wrapper')).toBeInTheDocument();
  });
});
