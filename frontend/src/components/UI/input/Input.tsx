import React from 'react';

import styling from './Input.module.scss';

import { Props } from './Input.types';

const Input: React.FC<Props> = ({ value, label, name, placeholder, type, onChange, testId, disabled, required }) => {
    const id = `${label}_${Date.now()}`;


    return (
        <div className={styling.container}>
            <label htmlFor={id} className={styling.label}
            >
                {label}
            </label>

            <input
                id={id}
                className={styling.input}
                value={value}
                type={type}
                name={name}
                placeholder={placeholder}
                data-testid={testId} 
                onChange={onChange}
                disabled={disabled}
                required={required}
                aria-disabled={disabled}
                aria-required={required}
            />
        </div>
    );
};

export default Input;
