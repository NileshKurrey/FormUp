interface ApiErrorOptions {
  message: string;
  statusCode: number;
  isOperational?: boolean;
}

export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(options: ApiErrorOptions) {
        super(options.message);
        this.statusCode = options.statusCode;
        this.isOperational = options.isOperational ?? true;
    }
}