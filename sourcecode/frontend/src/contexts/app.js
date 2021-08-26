import React from 'react';
import moment from 'moment';

export default React.createContext({
    getNow: () => moment(),
    acceptedCookies: () => 'no',
});
