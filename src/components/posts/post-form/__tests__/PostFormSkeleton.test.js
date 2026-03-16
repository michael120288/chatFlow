import { render, screen } from '@testing-library/react';
import PostFormSkeleton from '../PostFormSkeleton';

describe('PostFormSkeleton', () => {
  it('renders without crashing', () => {
    render(<PostFormSkeleton />);
    expect(screen.getByTestId('post-form-skeleton')).toBeInTheDocument();
  });

  it('renders the post-form container', () => {
    const { container } = render(<PostFormSkeleton />);
    expect(container.querySelector('.post-form')).toBeInTheDocument();
  });

  it('renders the post form list', () => {
    const { container } = render(<PostFormSkeleton />);
    expect(container.querySelector('.post-form-list')).toBeInTheDocument();
  });
});
