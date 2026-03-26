import AuthTabs from '@pages/auth/auth-tabs/AuthTabs';
import { fireEvent, render, screen, within } from '@root/test.utils';

describe('Authtabs', () => {
  it('signin tab should be displayed', () => {
    render(<AuthTabs />);
    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    expect(signInBtn).toBeInTheDocument();
    expect(signInBtn).toHaveClass('active');
  });

  it('sign up tab should be displayed', () => {
    render(<AuthTabs />);
    const signUpBtn = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpBtn);
    expect(signUpBtn).toHaveClass('active');
  });
});
