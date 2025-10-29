import type { IHttpRequest,IHttpResponse } from "../../domain/repositories/IHttpServer.js";
import type { NextFunction, Request, Response } from "express";
// generate an async error wrapper for express routes
export const CatchAsync = (fn: (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => Promise<any>) => (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};