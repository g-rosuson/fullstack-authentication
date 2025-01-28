import { useEffect, useRef } from 'react';

import styling from './Dropdown.module.scss';

import { Props } from './Dropdown.types';

const Dropdown = ({ open, close, actions, controller }: Props) => {
    // Refs
    const menuRef = useRef<HTMLDivElement>(null);


    /**
     * Attaches an event listener when the menu is open, and
     * removes the listener when the component unmounts.
     */
    useEffect(() => {
        /**
         * Closes the menu when the user clicks outside it.
         */
        const clickOutsideHandler = (event: Event) => {
            if (!menuRef.current?.contains(event.target as Element)) {
                close();
            }
        };

        if (open) {
            window.addEventListener('click', clickOutsideHandler);
        }

        return () => {
            window.removeEventListener('click', clickOutsideHandler);
        };
    }, [close, open]);


    return (
       <div ref={menuRef} className={styling.container}>
           {controller}

           <ul
               className={open ? styling.dropdown : styling.hidden}
               role="menu"
               aria-expanded={open}
               aria-label="User menu"
               hidden={!open}
           >
               {actions.map(({ label, onClick, onKeyDown }) => (
                   <li
                       key={label}
                       className={styling.item}
                       role="menuitem"
                       tabIndex={open ? 0 : -1}
                       onClick={onClick}
                       onKeyDown={onKeyDown}
                   >
                       {label}
                   </li>
               ))}
           </ul>
       </div>
    );
};

export default Dropdown;