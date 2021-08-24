export type ApiExceptionBody = {
    success?: boolean;
    message: string;
    messageKey?: string;
    extra?: any;
    trace?: string;
};

export default class ApiException extends Error {
    shouldReport = true;
    status = 500;

    constructor(
        message: string,
        shouldReport: boolean = true,
        status: number = 500
    ) {
        super(message);
        this.shouldReport = shouldReport;
        this.status = status;
    }

    getStatus(): number {
        return this.status;
    }

    getBody(): ApiExceptionBody {
        return {
            message: this.message,
        };
    }
}

export const errorResponse = (
    message: string,
    type: string,
    error: any = null
) => ({
    type,
    message,
    error,
});
