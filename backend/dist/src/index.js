import { createServiceContainer } from './infra/di/container.js';
export const myapp = async function () {
    const container = createServiceContainer();
    const app = container.app.getAppInstance();
    return app;
};
//# sourceMappingURL=index.js.map