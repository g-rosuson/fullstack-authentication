import AppSetup from './components/container/appSetup/AppSetup.tsx';
import Authenticator from './components/layout/authenticator/Authenticator.tsx';

import './stylesheets/global.scss';
import styling from './App.module.scss';

const App = () => {
    return (
        <AppSetup>
            <Authenticator>
                <div className={styling.container}>
                    App
                </div>
            </Authenticator>
        </AppSetup>
    );
}

export default App;
