import React from 'react';
import styled from 'styled-components';
import { Route, Switch, useLocation } from 'react-router-dom';
import loadable from '@loadable/component';
import Header from '../components/Header';
import Helmet from '../components/Helmet';
import CookieConsent from '../components/CookieConsent.jsx';
import NotFound from '../components/NotFound.jsx';
import windowHelper from '../helpers/window';

const Content = styled.div`
    min-height: 90vh;
`;

const Home = loadable(() => import('./routes/Home'));

const Routes = () => {
    const location = useLocation();

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <link
                    rel="canonical"
                    href={`${windowHelper.origin()}${location.pathname}`}
                />
                <meta
                    property="og:url"
                    content={`${windowHelper.origin()}${location.pathname}`}
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content={`${windowHelper.origin()}/logo_banner.jpg`}
                />
            </Helmet>
            <Content>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <NotFound />
                </Switch>
            </Content>
            <CookieConsent />
        </>
    );
};

export default Routes;
