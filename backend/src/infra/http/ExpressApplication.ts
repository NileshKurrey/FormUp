import express, {type RequestHandler } from "express";
import type { IHttpServer } from "../../domain/repositories/IHttpServer.js";

export class ExpressApplication implements IHttpServer {
  private app = express();

  constructor() {
    this.app.use(express.json());
  }

  registerRoute(method: string, path: string, handler: RequestHandler): void {
    (this.app as any)[method](path, handler);
  }

  getAppInstance() {
    return this.app;
  }
}
