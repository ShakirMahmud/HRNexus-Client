import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
    size = 'md', 
    color = 'blue', 
    fullWidth = false, 
    className = '' 
}) => {
    // Color variants
    const colorVariants = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500',
        purple: 'border-purple-500',
        gray: 'border-gray-500'
    };

    // Size variants
    const sizeVariants = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-[3px]',
        lg: 'w-16 h-16 border-4',
        xl: 'w-20 h-20 border-[5px]'
    };

    return (
        <div 
            className={`
                flex justify-center items-center 
                ${fullWidth ? 'w-full' : 'inline-block'}
                ${className}
            `}
        >
            <div 
                className={`
                    animate-spin rounded-full 
                    border-t-transparent border-solid 
                    ${sizeVariants[size] || sizeVariants.md}
                    ${colorVariants[color] || colorVariants.blue}
                `}
            ></div>
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    color: PropTypes.oneOf(['blue', 'green', 'red', 'purple', 'gray']),
    fullWidth: PropTypes.bool,
    className: PropTypes.string
};

export default LoadingSpinner;