import ApiException, { errorResponse } from './apiException';

export default class Client extends ApiException {
    error;
    key;

    constructor(message: string, key: string, error: any = {}) {
        super(message);
        this.key = key;
        this.error = error;
        this.shouldReport = false;
    }

    getStatus() {
        return 400;
    }

    getBody() {
        return errorResponse(this.message, this.key, this.error);
    }
}
