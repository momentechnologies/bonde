import getGraphqlError from './getGraphqlError.js';

export default (setStatus, mutation, variables, clb) => {
    setStatus({
        error: false,
        success: false,
        loading: true,
    });
    mutation({
        variables,
    })
        .then(() => {
            setStatus({
                error: false,
                success: true,
                loading: false,
            });
            clb && clb();
        })
        .catch((error) => {
            setStatus({
                error: getGraphqlError(error),
                success: false,
                loading: false,
            });
        });
};
