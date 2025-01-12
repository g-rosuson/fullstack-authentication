import { Route, Routes as ReactRouterDOMRoutes } from 'react-router-dom';

import Home from 'components/pages/home/Home';
import Dashboard from 'components/pages/dashboard/Dashboard';

const Routes = () => {
    return (
        <ReactRouterDOMRoutes>
            <Route path="/" element={<Home/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </ReactRouterDOMRoutes>
    )
};

export default Routes;