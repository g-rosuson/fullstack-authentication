import { BrowserRouter } from 'react-router-dom';

import AppSetup from 'components/container/appSetup/AppSetup';
import Content from 'components/layout/content/Content';
import TopBar from 'components/layout/topBar/TopBar';
import Routes from 'components/routing/routes/Routes';

import './stylesheets/global.scss';

const App = () => {
    return (
        <AppSetup>
            <BrowserRouter>
                <TopBar/>

                <Content>
                    <Routes/>
                </Content>
            </BrowserRouter>
        </AppSetup>
    );
}

export default App;
