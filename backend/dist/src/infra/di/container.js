import { ExpressApplication } from "../http/ExpressApplication.js";
export function createServiceContainer() {
    const app = new ExpressApplication();
    return {
        app,
    };
}
//# sourceMappingURL=container.js.map