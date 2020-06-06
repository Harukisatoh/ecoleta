import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreateLocation from './pages/CreateLocation';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path='/' exact />
            <Route component={CreateLocation} path='/cadastro' />
        </BrowserRouter>
    );
}

export default Routes;
