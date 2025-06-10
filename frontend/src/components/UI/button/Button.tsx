import Spinner from '../spinner/Spinner';

import styling from './Button.module.scss';

import { type Props } from './Button.types';

const Button = (props: Props) => {
    const {
        testId,
        type,
        variant,
        inline,
        disabled,
        hidden,
        isLoading,
        icon,
        ariaLabel,
        label,
        onClick,
    } = props;

    const classes = [styling.base];
    let content = null;
    
    if (icon) {
        content = icon;
        classes.push(styling.icon);
    }

    if (label) {
        content = label;
    }

    if (variant === 'primary') {
        classes.push(styling.primary);
    }

    if (inline) {
        classes.push(styling.inline);
    }


    /**
     * Returns all added classes as a concatenated
     * string with a whitespace between each class.
     */
    const getConcatenatedClasses = () => classes.join(' ');


    return (
        <button
            data-testid={testId}
            className={getConcatenatedClasses()}
            type={type}
            onClick={isLoading ? undefined : onClick}
            disabled={disabled || isLoading}
            hidden={hidden}
            aria-disabled={disabled || isLoading}
            aria-hidden={hidden}
            aria-busy={isLoading}
            aria-label={ariaLabel}
        >
            {isLoading ? <Spinner/> : content}
        </button>
    );
};

export default Button;
