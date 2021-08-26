import React from 'react';
import 'isomorphic-fetch';
import moment from 'moment';
import * as Sentry from '@sentry/react';

import Routes from './routes';
import AuthProvider from './containers/AuthProvider';
import AppContext from './contexts/app.js';

import './i18n';
import './index.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import ScrollToTop from './components/ScrollToTop.jsx';

const FallbackComponent = () => (
    <div>
        <h1>Noe skjedde</h1>
        <p>Noe skjedde når vi lastet inn siden.</p>
    </div>
);

const App = ({
    getNow = () => moment(),
    cookies,
    notFoundEvent = () => {},
    acceptedCookies = () => null,
}) => (
    <Sentry.ErrorBoundary showDialog fallback={FallbackComponent}>
        <AppContext.Provider
            value={{
                getNow,
                cookies,
                notFoundEvent,
                acceptedCookies,
            }}
        >
            <ScrollToTop>
                <AuthProvider>
                    <Routes />
                </AuthProvider>
            </ScrollToTop>
        </AppContext.Provider>
    </Sentry.ErrorBoundary>
);

export default App;
