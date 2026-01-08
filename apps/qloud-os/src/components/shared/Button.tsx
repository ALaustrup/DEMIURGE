import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-genesis-md font-medium transition-all duration-200 relative';
  
  const variantClasses = {
    primary: 'genesis-button-primary',
    secondary: 'genesis-button-secondary',
    ghost: 'bg-transparent/50 border border-genesis-border-cyan text-genesis-cipher-cyan hover:bg-genesis-cipher-cyan/20 hover:border-genesis-cipher-cyan hover:shadow-genesis-cyan',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
}

