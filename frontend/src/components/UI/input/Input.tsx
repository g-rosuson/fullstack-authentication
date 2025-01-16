import React from 'react';

import styling from './Input.module.scss';

import { Props } from './Input.types';

const Input: React.FC<Props> = ({ value, label, name, placeholder, type, onChange, disabled }) => {
    // Replaces spaces with hyphens and converts the label to lowercase
    const convertedLabel = label.replace(/\s+/g, '_').toLowerCase();

    // Create an id with the converted label and a timestamp
    const id = `${convertedLabel}_${Date.now()}`;


    return (
        <div className={styling.container}>
            <label htmlFor={id} className={styling.label}>
                {label}
            </label>

            <input
                id={id}
                className={styling.input}
                value={value}
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
                required
            />
        </div>
    );
};

export default Input;
