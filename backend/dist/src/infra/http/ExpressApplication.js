import express, {} from "express";
export class ExpressApplication {
    app = express();
    constructor() {
        this.app.use(express.json());
    }
    registerRoute(method, path, handler) {
        this.app[method](path, handler);
    }
    getAppInstance() {
        return this.app;
    }
}
//# sourceMappingURL=ExpressApplication.js.map