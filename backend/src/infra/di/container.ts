import type { IHttpServer } from "../../domain/repositories/IHttpServer.js";
import { ExpressApplication } from "../http/ExpressApplication.js";
import {WinstonLogger} from "../logger/winston.js"
import type { ILoggerRepository } from "../../domain/repositories/IloggerRepositry.js";
export interface ServiceContainer {
    app: IHttpServer;
    logger: ILoggerRepository;
}

export function createServiceContainer(): ServiceContainer {
  const app = new ExpressApplication();
  const logger = new WinstonLogger()
  return {
    app,
    logger,
  };
}



