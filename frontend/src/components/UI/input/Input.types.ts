import { ChangeEvent } from 'react';

type InputType = 'text' | 'password' | 'email' | 'number' | 'date';

export type Props =  {
    value: string;
    label: string;
    name: string;
    placeholder: string;
    type: InputType;
    // eslint-disable-next-line no-unused-vars
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}