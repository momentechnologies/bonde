export default (
    requestError,
    defaultValue = {
        message: 'Something happened',
        key: 'something_happened',
        error: {},
    }
) => {
    if (
        !requestError ||
        !requestError.graphQLErrors ||
        !Array.isArray(requestError.graphQLErrors) ||
        requestError.graphQLErrors.length === 0
    ) {
        return defaultValue;
    }

    return requestError.graphQLErrors[0];
};
