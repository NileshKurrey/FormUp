export interface IHttpServer {
    registerRoute(method:string,path:string,handler:Function): void;
    getAppInstance(): any;
}