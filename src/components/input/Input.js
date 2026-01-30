import PropTypes from 'prop-types';
import '@components/input/Input.scss';
import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = props.type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-row">
      {props.labelText && (
        <label htmlFor={props.name} className="form-label">
          {props.labelText}
        </label>
      )}
      <div className="input-wrapper">
        <input
          ref={ref}
          id={props.id}
          name={props.name}
          type={isPasswordInput && showPassword ? 'text' : props.type}
          value={props.value}
          onChange={props.handleChange}
          placeholder={props.placeholder}
          onClick={props.onClick}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          className={`form-input ${props.className}`}
          style={props.style}
          autoComplete="false"
          accept={props.accept}
        />
        {isPasswordInput && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
});

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  labelText: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  accept: PropTypes.string
};

export default Input;
