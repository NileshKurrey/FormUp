export interface ILoggerRepository {
    logInfo(message: string): void;
    logError(message: string): void;
}