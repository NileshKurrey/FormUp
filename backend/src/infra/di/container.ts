import type { IHttpServer } from "../../domain/repositories/IHttpServer.js";
import { ExpressApplication } from "../http/ExpressApplication.js";
import {logger} from "../logger/winston.js"
export interface ServiceContainer {
    app: IHttpServer;
    logger:any
}

export function createServiceContainer(): ServiceContainer {
  const app = new ExpressApplication();
  return {
    app,
    logger,
  };
}



