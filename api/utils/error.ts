interface ErrorData {
    /**
     * Human readable error message
     */
    message: string;
    /**
     * Additional properties
     */
    [key: string]: any;
}

export class APIError extends Error {
    statusCode: number;
    data: ErrorData | null;

    constructor(statusCode: number, data: ErrorData | null = null) {
        super();
        this.statusCode = statusCode;
        this.data = data;
    }
}
