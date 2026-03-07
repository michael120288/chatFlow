import Home from '@pages/home/Home';
import { render, screen } from '@root/test.utils';
import { fireEvent } from '@testing-library/react';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

describe('Home', () => {
  describe('Test Quest button', () => {
    let origLocation;

    beforeEach(() => {
      localStorage.clear();
      origLocation = window.location;
      delete window.location;
      window.location = { href: '' };
    });

    afterEach(() => {
      window.location = origLocation;
    });

    it('navigates to http://localhost:5173 when no tq_sso_token', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /test quest/i });
      fireEvent.click(button);
      expect(window.location.href).toBe('http://localhost:5173');
    });

    it('navigates with SSO token when tq_sso_token exists', () => {
      localStorage.setItem('tq_sso_token', 'my-jwt');
      render(<Home />);
      const button = screen.getByRole('button', { name: /test quest/i });
      fireEvent.click(button);
      expect(window.location.href).toBe(
        `http://localhost:5173/sso?token=${encodeURIComponent('my-jwt')}`
      );
    });
  });
});
