import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Input from './Input';
import { Props } from './Input.types';

/**
 * Renders a controlled input element into the JS-DOM.
 */
const setupControlledInput = () => {
    const ControlledInputComponent = () => {
        // State
        const [value, setValue] = useState('');


        /**
         * Sets the new value of the input element in the state.
         */
        const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
        };
    
        return (
            <Input
                value={value}
                label="Test"
                name="test"
                placeholder="Test"
                type="text"
                onChange={changeHandler}
            />
        );
    };

    render(<ControlledInputComponent />);
}


/**
 * Renders the input with the given props into the JS-DOM and returns testing utilities.
 */
const setupInput = (props: Props) => {
    return render((
        <Input
            value={props.value}
            label={props.label}
            name={props.name}
            placeholder={props.placeholder}
            type={props.type}
            onChange={props.onChange}
            disabled={props.disabled}
            required={props.required}
        />
    ));
};

/**
 * Test cases for the Input component.
 */
describe('Input component', () => {
    let props: Props;

    beforeEach(() => {
        props = {
            value: 'test',
            label: 'Test',
            name: 'test',
            placeholder: 'Test',
            type: 'text',
            onChange: () => null,
            disabled: false,
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Test input element
    it('has an input HTML element', () => {
        setupInput(props);
        const container = screen.getByTestId('input-container');
        const inputElement = container.querySelector('input');
        expect(inputElement).toBeInstanceOf(HTMLInputElement);
    });

    it('input element has the correct value', () => {
        setupInput(props);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).toHaveValue(props.value);
    });

    it('input element has the correct name', () => {
        setupInput(props);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).toHaveAttribute('name', props.name);
    });

    it('input element has the correct placeholder', () => {
        setupInput(props);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).toHaveAttribute('placeholder', props.placeholder);
    });

    it('input element is disabled when the "disabled" prop is true', () => {
        const disabledProps = { ...props, disabled: true };
        setupInput(disabledProps);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).toBeDisabled();
    });

    it('input element is enabled when the "disabled" prop is false', () => {
        setupInput(props);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).not.toBeDisabled();
    });

    it('input element is enabled when the "disabled" prop is undefined', () => {
        const disabledProps = { ...props, disabled: undefined };
        setupInput(disabledProps);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).not.toBeDisabled();
    });

    it('input element is required when the "required" prop is true', () => {
        const requiredProps = { ...props, required: true };
        setupInput(requiredProps);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).toHaveAttribute('required');
    });

    it('input element is not required when the "required" prop is false', () => {
        const requiredProps = { ...props, required: false };
        setupInput(requiredProps);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).not.toHaveAttribute('required');
    });

    it('input element is not required when the "required" prop is undefined', () => {
        setupInput(props);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).not.toHaveAttribute('required');
    });

    it('input element has the correct "type"', () => {
        const typeProps = { ...props, type: 'password' as const };
        setupInput(typeProps);
        const inputElement = screen.getByTestId('input');
        expect(inputElement).toHaveProperty('type', 'password');
    });

    it('input element receives the correct "value" from parent component', () => {
        setupControlledInput();
        const input = screen.getByTestId('input');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(input).toHaveValue('new value');
    });

    // Test label element
    it('has a label HTML element', () => {
        setupInput(props);
        const container = screen.getByTestId('input-container');
        const labelElement = container.querySelector('label');
        expect(labelElement).toBeInTheDocument();
    });

    it('label element has the correct text content', () => {
        setupInput(props);
        const labelElement = screen.getByTestId('label');
        expect(labelElement).toHaveTextContent(props.label);
    });

    it('label element is correctly associated with the input', () => {
        setupInput(props);
        const container = screen.getByTestId('input-container');
        const labelElement = container.querySelector('label');
        const inputElement = container.querySelector('input');
        expect(labelElement).toHaveAttribute('for', inputElement?.id);
    });
});