import styling from './Button.module.scss';

import { Props } from './Button.types';

const Button = ({ children, type, onClick, disabled, hidden, isLoading }: Props) => {
    return (
        <button
            className={styling.button}
            type={type}
            onClick={isLoading ? undefined : onClick}
            disabled={disabled}
            hidden={hidden}
        >
            {isLoading ? <div>Spinner</div> : children}
        </button>
    );
};

export default Button;
