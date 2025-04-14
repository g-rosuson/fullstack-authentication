import styling from './Avatar.module.scss';

import { Props } from './Avatar.types';

const Avatar = ({ email, onClick }: Props) => {
    const firstLetter = email.toUpperCase()[0];


    return (
        <button
            className={styling.avatar}
            data-testid="avatar"
            aria-label="user avatar"
            onClick={onClick}
        >
            <span className={styling.label}>
                {firstLetter}
            </span>
        </button>
    );
};

export default Avatar;