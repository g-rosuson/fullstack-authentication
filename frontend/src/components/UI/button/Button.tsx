import Spinner from '../spinner/Spinner';

import styling from './Button.module.scss';

import { Props } from './Button.types';

const Button = ({ children, type, onClick, disabled, hidden, isLoading, testId }: Props) => {
    return (
        <button
            data-testid={testId}
            className={styling.button}
            type={type}
            onClick={isLoading ? undefined : onClick}
            disabled={disabled}
            hidden={hidden}
            aria-disabled={disabled || isLoading}
            aria-hidden={hidden}
            aria-busy={isLoading}
        >
            {isLoading ? <Spinner/> : children}
        </button>
    );
};

export default Button;
