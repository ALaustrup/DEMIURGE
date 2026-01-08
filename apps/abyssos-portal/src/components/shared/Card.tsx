import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`genesis-glass rounded-genesis-lg shadow-genesis-dark ${className}`}
    >
      {children}
    </div>
  );
}

