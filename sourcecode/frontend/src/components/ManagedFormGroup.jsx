import React from 'react';
import { FormFeedback, FormGroup } from 'reactstrap';
import getGraphqlError from '../helpers/getGraphqlError.js';

export const getError = (error, inputKey) => {
    if (!error) {
        return false;
    }

    const graphQlError = getGraphqlError(error);
    let actualError = error;

    if (error.type !== 'validation') {
        if (graphQlError.type === 'validation') {
            actualError = graphQlError;
        } else {
            return false;
        }
    }

    const inputErrors = actualError.error.messages.filter(
        (e) => e.key === inputKey
    );

    if (inputErrors.length === 0) {
        return false;
    }

    return inputErrors.map((ie) => ie.message);
};

export default ({ error, inputKey, children, otherProps }) => {
    const inputErrors = getError(error, inputKey);

    return (
        <FormGroup {...otherProps}>
            {children(inputErrors)}
            {inputErrors
                ? inputErrors.map((message, index) => (
                      <FormFeedback key={index}>{message}</FormFeedback>
                  ))
                : null}
        </FormGroup>
    );
};
