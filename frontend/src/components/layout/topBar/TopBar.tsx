import { Link } from 'react-router-dom';

import styling from './TopBar.module.scss';

const TopBar = () => {
    return (
        <header className={styling.header}>
            <nav>
                <ul className={styling.links}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default TopBar;