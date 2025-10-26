import winston from 'winston';
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js';


export class WinstonLogger implements ILoggerRepository {
    private logger: winston.Logger;

    constructor(){
        this.logger = winston.createLogger({
            level:"debug",
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message}) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })),
            transports:[
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
        });
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }
}