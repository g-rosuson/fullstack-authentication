import { BrowserRouter } from 'react-router-dom';

import AppSetup from 'components/container/appSetup/AppSetup';
import Content from 'components/layout/content/Content';
import Routes from 'components/routing/routes/Routes';

import './stylesheets/global.scss';

const App = () => {
    return (
        <AppSetup>
            <BrowserRouter>
                <Content>
                    <Routes/>
                </Content>
            </BrowserRouter>
        </AppSetup>
    );
}

export default App;
