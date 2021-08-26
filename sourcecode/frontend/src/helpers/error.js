import getGraphqlError from './getGraphqlError.js';

export const getError = error => {
    const graphqlError = getGraphqlError(error, null);
    if (graphqlError) {
        return graphqlError;
    }

    return error;
};
