import { resetPasswordMockError } from '@mocks/handlers/auth';
import { server } from '@mocks/server';
import ResetPassword from '@pages/auth/reset-password/ResetPassword';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { createSearchParams } from 'react-router-dom';

describe('ResetPassword', () => {
  beforeEach(() => {
    const url = `/reset-password?${createSearchParams({ token: '1234567890' })}`;
    const history = createBrowserHistory();
    history.push(url);
  });

  it('should render both password inputs', () => {
    render(<ResetPassword />);
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('submit button should be disabled when inputs are empty', () => {
    render(<ResetPassword />);
    expect(screen.getByRole('button', { name: /reset password/i })).toBeDisabled();
  });

  it('should have "Back to Sign In" navigation', () => {
    render(<ResetPassword />);
    const backLinks = screen.getAllByText(/Back to Sign In/i);
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('should enable button when both passwords are filled', () => {
    render(<ResetPassword />);
    const buttonElement = screen.getByRole('button', { name: /reset password/i });
    expect(buttonElement).toBeDisabled();

    userEvent.type(screen.getByLabelText('New Password'), 'qwerty1');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'qwerty1');
    expect(buttonElement).toBeEnabled();
  });

  it('should show loading text while request is in flight', async () => {
    render(<ResetPassword />);
    userEvent.type(screen.getByLabelText('New Password'), 'qwerty1');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'qwerty1');

    userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByRole('button', { name: /reset/i }).textContent).toEqual('Resetting password…');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reset/i }).textContent).toEqual('Reset Password');
    });
  });

  describe('Success', () => {
    it('should display success alert after valid reset', async () => {
      render(<ResetPassword />);
      userEvent.type(screen.getByLabelText('New Password'), 'qwerty1');
      userEvent.type(screen.getByLabelText('Confirm Password'), 'qwerty1');
      userEvent.click(screen.getByRole('button', { name: /reset password/i }));

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-success');
      expect(alert.textContent).toEqual('Password successfully updated.');
    });
  });

  describe('Error', () => {
    it('should display error alert and red border on mismatch', async () => {
      server.use(resetPasswordMockError);
      render(<ResetPassword />);
      userEvent.type(screen.getByLabelText('New Password'), 'qwerty1');
      userEvent.type(screen.getByLabelText('Confirm Password'), 'qwerty');
      userEvent.click(screen.getByRole('button', { name: /reset password/i }));

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-error');
      expect(alert.textContent).toEqual('Passwords do not match');
      await waitFor(() => expect(screen.getByLabelText('New Password')).toHaveStyle({ border: '1.5px solid #fca5a5' }));
    });
  });
});
