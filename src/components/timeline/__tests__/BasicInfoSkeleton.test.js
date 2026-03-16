import { render, screen } from '@testing-library/react';
import BasicInfoSkeleton from '../BasicInfoSkeleton';

describe('BasicInfoSkeleton', () => {
  it('renders without crashing', () => {
    render(<BasicInfoSkeleton />);
    expect(screen.getByTestId('basic-info')).toBeInTheDocument();
  });

  it('renders the side-container', () => {
    const { container } = render(<BasicInfoSkeleton />);
    expect(container.querySelector('.side-container')).toBeInTheDocument();
  });

  it('renders the side-container-header', () => {
    const { container } = render(<BasicInfoSkeleton />);
    expect(container.querySelector('.side-container-header')).toBeInTheDocument();
  });
});
