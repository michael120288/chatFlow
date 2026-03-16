import { render, screen } from '@testing-library/react';
import SuggestionsSkeletons from '../SuggestionsSkeleton';

describe('SuggestionsSkeleton', () => {
  it('renders without crashing', () => {
    render(<SuggestionsSkeletons />);
    expect(screen.getByTestId('suggestions')).toBeInTheDocument();
  });

  it('renders the suggestions list container', () => {
    const { container } = render(<SuggestionsSkeletons />);
    expect(container.querySelector('.suggestions-list-container')).toBeInTheDocument();
  });

  it('renders 5 suggestion placeholder items', () => {
    const { container } = render(<SuggestionsSkeletons />);
    expect(container.querySelectorAll('.suggestions-item')).toHaveLength(5);
  });
});
