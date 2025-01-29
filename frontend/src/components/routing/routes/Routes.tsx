import { Route, Routes as ReactRouterDOMRoutes } from 'react-router-dom';

import Authenticator from '../../layout/authenticator/Authenticator';
import Authentication from '../../pages/authentication/Authentication';
import Home from '../../pages/home/Home';

import config from 'config';

const Routes = () => {
    return (
        <ReactRouterDOMRoutes>
            <Route path={config.routes.login} element={<Authentication/>} />
            <Route path={config.routes.register} element={<Authentication/>} />

            <Route element={<Authenticator/>}>
                <Route path={config.routes.root} element={<Home/>}/>
            </Route>
        </ReactRouterDOMRoutes>
    )
};

export default Routes;