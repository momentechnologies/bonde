import React from 'react';
import { gql } from '@apollo/client';
import configContext from '../contexts/config.js';

export const configFragment = gql`
    fragment ConfigFragment on Query {
        config {
            reward {
                vipPointsLast12Months
                reviewPoints
                vipFreeShippingAfterAmount
                dailyVisitPoints
            }
        }
    }
`;

const ConfigContainer = ({ config, children }) => {
    return (
        <configContext.Provider value={config}>
            {children}
        </configContext.Provider>
    );
};

export default ConfigContainer;
