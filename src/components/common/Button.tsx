import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    ...props
}: ButtonProps) {

    const baseStyles = 'rounded font-bold transition flex items-center justify-center gap-2';

    const variants = {
        primary: 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20',
        secondary: 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white border border-zinc-600',
        danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20',
        ghost: 'bg-transparent hover:bg-zinc-700 text-gray-400 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}
