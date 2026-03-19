import { forgotPasswordMockError } from '@mocks/handlers/auth';
import { server } from '@mocks/server';
import ForgotPassword from '@pages/auth/forgot-password/ForgotPassword';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

describe('ForgotPassword', () => {
  it('form should have email address label', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText('Email address');
    expect(emailInput).toBeInTheDocument();
  });

  it('should have "Back to Sign In" navigation', () => {
    render(<ForgotPassword />);
    const backLinks = screen.getAllByText(/Back to Sign In/i);
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
  });

  describe('Button', () => {
    it('button should be disabled when email is empty', () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled after typing an email', () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();

      const emailInput = screen.getByLabelText('Email address');
      userEvent.type(emailInput, 'manny@test.com');
      expect(buttonElement).toBeEnabled();
    });

    it('should show loading text while request is in flight', async () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email address');
      userEvent.type(emailInput, 'manny@test.com');

      userEvent.click(buttonElement);

      expect(screen.getByRole('button').textContent).toEqual('Sending reset link…');
      await waitFor(() => {
        expect(screen.getByRole('button').textContent).toEqual('Send Reset Link');
      });
    });
  });

  describe('Success', () => {
    it('should display success alert on valid email', async () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email address');
      userEvent.type(emailInput, 'manny@test.com');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-success');
      expect(alert.textContent).toEqual('Password reset email sent.');
    });
  });

  describe('Error', () => {
    it('should display error alert and red border on failure', async () => {
      server.use(forgotPasswordMockError);
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email address');
      userEvent.type(emailInput, 'bad@email.com');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-error');
      expect(alert.textContent).toEqual('Field must be valid');
      await waitFor(() => expect(emailInput).toHaveStyle({ border: '1.5px solid #fca5a5' }));
    });
  });
});
