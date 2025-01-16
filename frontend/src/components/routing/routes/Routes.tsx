import { Route, Routes as ReactRouterDOMRoutes } from 'react-router-dom';

import Authentication from 'components/pages/authentication/Authentication';
import Home from 'components/pages/home/Home';

const Routes = () => {
    return (
        <ReactRouterDOMRoutes>
            {/* Routes that don't require authentication */}
            <Route path="/login" element={<Authentication/>} />
            <Route path="/register" element={<Authentication/>} />

            {/* Routes that require authentication */}
            <Route path="/" element={<Home/>}/>
        </ReactRouterDOMRoutes>
    )
};

export default Routes;