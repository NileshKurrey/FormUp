import express, {type NextFunction, type Request, type Response } from "express";
import type { IHttpServer,IHttpRequest,IHttpResponse } from "../../domain/repositories/IHttpServer.js";
import cors from "cors";
import cookieParer from 'cookie-parser'
import { env } from "../../shared/utils/env/env.js";
export class ExpressApplication implements IHttpServer {
   private app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({
      origin: env.LOCALHOST,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    this.app.use(cookieParer());
  }

  private adaptHandler(handler: (req: IHttpRequest, res: IHttpResponse) => any) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(handler(req as IHttpRequest, res as IHttpResponse)).catch(next);
    };
  }

  use(path: string, handler: any) {
    this.app.use(path, handler);
  }

  get(path: string, handler: any) {
    this.app.get(path, this.adaptHandler(handler));
  }

  post(path: string, handler: any) {
    this.app.post(path, this.adaptHandler(handler));
  }

  put(path: string, handler: any) {
    this.app.put(path, this.adaptHandler(handler));
  }

  delete(path: string, handler: any) {
    this.app.delete(path, this.adaptHandler(handler));
  }
  getAppInstance() {
    return this.app;
  }
}
