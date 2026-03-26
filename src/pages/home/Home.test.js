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
    it('navigates to /auth when not logged in and Play Now is clicked', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /play now/i });
      fireEvent.click(button);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/auth');
    });
  });
});
