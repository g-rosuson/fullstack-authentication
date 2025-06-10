import { Outlet } from 'react-router-dom';

import Sidebar from '../sidebar/Sidebar';
import TopBar from '../topBar/TopBar';

import styling from './Dashboard.module.scss';

const Dashboard = () => {
    return (
        <div className={styling.container}>
            <Sidebar/>

            <main className={styling.wrapper}>
                <TopBar/>

                <section className={styling.outlet}>
                    <Outlet/>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;