import React from 'react';
import './styles.css';

interface ButtonProps {
  label: string;
  type?: 'number' | 'operator' | 'function';
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type = 'number',
  onClick,
  className = ''
}) => {
  return (
    <button
      className={`calculator-button ${type} ${className}`}
      onClick={onClick}
      data-testid={`button-${label}`}
    >
      {label}
    </button>
  );
};

export default Button; 