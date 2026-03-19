import Input from '@components/input/Input';
import { render, screen, fireEvent } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
  describe('label', () => {
    it('renders without a label when labelText is not provided', () => {
      render(<Input name="email" type="text" />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('renders a label linked to the input when labelText is provided', () => {
      render(<Input id="email" name="email" type="text" labelText="Email address" />);
      const label = screen.getByText('Email address');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'email');
    });

    it('getByLabelText finds the input via the label', () => {
      render(<Input id="username" name="username" type="text" labelText="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
  });

  describe('text input', () => {
    it('renders a text input with placeholder', () => {
      render(<Input name="search" type="text" placeholder="Search here" />);
      expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
    });

    it('does not render a password toggle button for non-password inputs', () => {
      render(<Input name="email" type="text" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls handleChange when the user types', () => {
      const handleChange = jest.fn();
      render(<Input name="email" type="text" value="" handleChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when the input receives focus', () => {
      const onFocus = jest.fn();
      render(<Input name="email" type="text" onFocus={onFocus} />);
      fireEvent.focus(screen.getByRole('textbox'));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when the input loses focus', () => {
      const onBlur = jest.fn();
      render(<Input name="email" type="text" onBlur={onBlur} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('applies a custom style to the input', () => {
      render(<Input name="email" type="text" style={{ border: '2px solid red' }} />);
      expect(screen.getByRole('textbox')).toHaveStyle({ border: '2px solid red' });
    });
  });

  describe('password input', () => {
    it('renders a password toggle button for password inputs', () => {
      render(<Input name="password" type="password" />);
      expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    });

    it('input type is password by default', () => {
      render(<Input name="password" type="password" />);
      // password inputs don't have role="textbox", query by display value area
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('clicking toggle reveals the password as plain text', () => {
      render(<Input name="password" type="password" />);
      const toggleBtn = screen.getByRole('button', { name: /show password/i });
      userEvent.click(toggleBtn);
      const input = document.querySelector('input[type="text"]');
      expect(input).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
    });

    it('clicking toggle again hides the password', () => {
      render(<Input name="password" type="password" />);
      const toggleBtn = screen.getByRole('button', { name: /show password/i });
      userEvent.click(toggleBtn);
      userEvent.click(screen.getByRole('button', { name: /hide password/i }));
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });
});
