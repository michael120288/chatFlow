import Home from '@pages/home/Home';
import { render, screen } from '@root/test.utils';
import { fireEvent } from '@testing-library/react';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

describe('Home', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  describe('Test Quest button', () => {
    it('navigates to /app/game when clicked', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /test quest/i });
      fireEvent.click(button);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/app/game');
    });
  });
});
