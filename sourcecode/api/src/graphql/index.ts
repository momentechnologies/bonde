import schema from './schema';
import * as ExpressGraphQL from 'express-graphql';
import Express from 'express';
import logger from '../services/logger';
import * as Graphql from 'graphql';
import HttpErrors from 'http-errors';
import ApiException, { ApiExceptionBody } from '../exceptions/apiException';
import appConfig from '../config/app';
import { CustomRequest } from '../types/CustomRequest';

const router = Express.Router();

const searchOriginalError = (error) => {
    if (error.originalError) {
        return searchOriginalError(error.originalError);
    }

    return error;
};

const customFormatErrorFn = (error) => {
    const originalError = searchOriginalError(error);

    if (
        originalError instanceof Graphql.GraphQLError ||
        originalError instanceof HttpErrors.BadRequest
    ) {
        return originalError;
    }

    let body: ApiExceptionBody = {
        message: 'Server error',
        messageKey: 'internal_error',
    };

    let report = true;

    if (originalError instanceof ApiException) {
        body = originalError.getBody();
        report = originalError.shouldReport;
    } else {
        logger.error(error);

        if (!appConfig.isProd) {
            body.extra = originalError;
            body.trace = error.stack;
        }
    }

    return body;
};

router.use(
    '/graphql',
    ExpressGraphQL.graphqlHTTP((req: CustomRequest) => ({
        schema,
        graphiql: true,
        customFormatErrorFn,
        context: req.context,
    }))
);

export default router;
