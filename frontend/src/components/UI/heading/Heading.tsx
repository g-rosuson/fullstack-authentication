import React from 'react';

// eslint-disable-next-line css-modules/no-unused-class
import styling from './Heading.module.scss';

import { Props } from './Heading.types';

const Heading = ({ size, level, children, removeMargin }: Props) => {
    // Determine the heading classname based on the provided size
    let className = styling.heading;

    if (size === 'l') {
        className = styling.large;
    }

    if (size === 'm') {
        className = styling.medium;
    }

    if (size === 's') {
        className = styling.small;
    }


    // Determine the heading element based on the provided level
    const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;


    return (
        <Tag className={className} data-remove-margin={removeMargin}>
            {children}
        </Tag>
    );
};

export default Heading;