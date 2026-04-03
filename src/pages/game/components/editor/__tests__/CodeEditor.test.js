import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeEditor } from '../CodeEditor';

// Monaco editor doesn't run in jsdom — replace it with a controlled textarea
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      readOnly={options?.readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}));

describe('CodeEditor', () => {
  it('renders the editor container', () => {
    render(<CodeEditor value="const x = 1;" onChange={() => {}} />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    render(<CodeEditor value="const x = 1;" onChange={() => {}} />);
    expect(screen.getByTestId('monaco-editor')).toHaveValue('const x = 1;');
  });

  it('calls onChange when the user types', async () => {
    const onChange = jest.fn();
    render(<CodeEditor value="" onChange={onChange} />);
    await userEvent.type(screen.getByTestId('monaco-editor'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('is not readOnly by default', () => {
    render(<CodeEditor value="" onChange={() => {}} />);
    expect(screen.getByTestId('monaco-editor')).not.toHaveAttribute('readonly');
  });

  it('is readOnly when readOnly prop is true', () => {
    render(<CodeEditor value="" onChange={() => {}} readOnly={true} />);
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('readonly');
  });
});
