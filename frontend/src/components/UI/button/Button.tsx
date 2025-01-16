import styling from './Button.module.scss';

import { Props } from './Button.types';

const Button = ({ children, type, onClick, disabled, addTopMargin }: Props) => {
    let className = styling.button;

    if (addTopMargin) {
        className = `${className} ${styling.marginTop}`;
    }


    return (
        <button
            className={className}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
