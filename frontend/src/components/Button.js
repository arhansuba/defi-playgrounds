// frontend/src/components/Button.js
import React from 'eact';
import PropTypes from 'prop-types';

function Button({ children, onClick, type, disabled, className }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'ubmit', 'eset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
  className: '',
};

export default Button;