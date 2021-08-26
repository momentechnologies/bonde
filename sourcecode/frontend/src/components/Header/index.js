import { Route, Switch } from 'react-router-dom';
import React from 'react';
import ClientHeaderContainer from './ClientHeaderContainer.jsx';

export default () => (
    <Switch>
        <Route component={ClientHeaderContainer} />
    </Switch>
);
