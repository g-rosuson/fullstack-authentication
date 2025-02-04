import { Route, Routes as ReactRouterDOMRoutes } from 'react-router-dom';

import Authenticate from '../../layout/authenticate/Authenticate';
import Authentication from '../../pages/authentication/Authentication';
import Home from '../../pages/home/Home';

import config from 'config';

const Routes = () => {
    return (
        <ReactRouterDOMRoutes>
            <Route path={config.routes.login} element={<Authentication/>} />
            <Route path={config.routes.register} element={<Authentication/>} />

            <Route element={<Authenticate/>}>
                <Route path={config.routes.root} element={<Home/>}/>
            </Route>
        </ReactRouterDOMRoutes>
    )
};

export default Routes;