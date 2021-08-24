import ApiException, { errorResponse } from './apiException';

export default class EndpointNotFound extends ApiException {
    path;
    method;

    constructor(path: string, method: string) {
        super('Endpoint was not found');
        this.path = path;
        this.method = method;
        this.shouldReport = false;
    }

    getStatus() {
        return 404;
    }

    getBody() {
        return errorResponse(this.message, 'endpoint_not_found', {
            path: this.path,
            method: this.method,
        });
    }
}
