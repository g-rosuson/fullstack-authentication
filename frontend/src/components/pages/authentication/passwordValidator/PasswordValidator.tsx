import { memo, useEffect, useState } from 'react';

import { Tick } from 'components/UI/icons/Icons';

import utils from 'utils';

import styling from './PasswordValidator.module.scss';

import constants from './constants';
import { Props } from './PasswordValidator.types';


const PasswordValidator = ({ password, confirmationPassword, hidden, onChange }: Props) => {
    // State
    const [isValid, setIsValid] = useState(false);


    // Determine whether the password is valid
    const hasSpecialCharacter = utils.regex.hasSpecialCharacter(password);
    const hasLowercase = utils.regex.hasLowercaseCharacter(password);
    const hasUppercase = utils.regex.hasUppercaseCharacter(password);
    const hasNumber = utils.regex.hasNumber(password);
    const hasValidLength = password?.length >= 8;


    // Confirm that password match
    const passwordsMatch = !!password && (password === confirmationPassword) ? true : false;


    /**
     * Check if the password has changed from being invalid to valid
     * or the other way around and pass the new state to the parent.
     */
    useEffect(() => {
        if (passwordsMatch && hasSpecialCharacter && hasLowercase && hasUppercase && hasNumber && hasValidLength && !isValid) {
            setIsValid(true);
            onChange(true);
        }

        if ((!passwordsMatch || !hasSpecialCharacter || !hasLowercase || !hasUppercase || !hasNumber || !hasValidLength) && isValid) {
            setIsValid(false);
            onChange(false);
        }
    }, [hasLowercase, hasUppercase, hasNumber, hasSpecialCharacter, hasValidLength, isValid, passwordsMatch, onChange]);


    // Determine validation options
    const validationItems = [
        {
            text: constants.labels.lowerCase,
            isValid: hasLowercase,
        },
        {
            text: constants.labels.upperCase,
            isValid: hasUppercase,
        },
        {
            text: constants.labels.number,
            isValid: hasNumber,
        },
        {
            text: constants.labels.specialCharacter,
            isValid: hasSpecialCharacter,
        },
        {
            text: constants.labels.eightCharacters,
            isValid: hasValidLength,
        },
         {
            text: constants.labels.passwordsMatch,
            isValid: passwordsMatch,
        },
    ];


    if (hidden) {
        return null;
    }


    return (
        <div className={styling.validator}>
            {validationItems.map(({ text, isValid }, index) => (
                <div className={styling.item} key={index}>
                    <div className={isValid ? styling.valid : styling.circle}>
                        <div className={styling.icon} hidden={!isValid}>
                            <Tick thick/>
                        </div>
                    </div>

                    <span className={styling.text}>{text}</span>
                </div>
            ))}
        </div>
    );
};


export default memo(PasswordValidator);