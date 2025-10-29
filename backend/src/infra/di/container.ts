import type { IHttpServer } from "../../domain/repositories/IHttpServer.js";
import { ExpressApplication } from "../http/ExpressApplication.js";
import {WinstonLogger} from "../logger/winston.js"
import type { ILoggerRepository } from "../../domain/repositories/IloggerRepositry.js";
import type { IDatabaseRepository } from "../../domain/repositories/IDatabaseRepostry.js";
import { PrismaDb } from "../database/prismadb.js";
export interface ServiceContainer {
    app: IHttpServer;
    logger: ILoggerRepository;
    database: IDatabaseRepository;
}

export function createServiceContainer(): ServiceContainer {
  const app = new ExpressApplication();
  const logger = new WinstonLogger();
  const database = new PrismaDb();
  return {
    app,
    logger,
    database
  };
}



