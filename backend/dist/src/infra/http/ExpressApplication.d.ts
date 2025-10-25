import { type RequestHandler } from "express";
import type { IHttpServer } from "../../domain/repositories/IHttpServer.js";
export declare class ExpressApplication implements IHttpServer {
    private app;
    constructor();
    registerRoute(method: string, path: string, handler: RequestHandler): void;
    getAppInstance(): import("express-serve-static-core").Express;
}
//# sourceMappingURL=ExpressApplication.d.ts.map