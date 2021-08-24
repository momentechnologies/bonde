import ApiException, { ApiExceptionBody } from '../exceptions/apiException';
import { NextFunction, Request, Response } from 'express';

export default (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction // eslint-disable-line
) => {
    let body: ApiExceptionBody = {
        success: false,
        message: 'Server error',
        extra: err,
        trace: null as string | null,
    };

    let status = 500;

    if (err instanceof ApiException) {
        status = err.getStatus();
        body = err.getBody();
    } else {
        console.error(err.stack);
        body.trace = err.stack;
    }

    res.status(status).json(body);
};
