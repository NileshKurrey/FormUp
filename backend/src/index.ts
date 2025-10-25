
import { createServiceContainer, type ServiceContainer } from './infra/di/container.js';


export const myapp = async function(){
 const container: ServiceContainer = createServiceContainer();
 const app = container.app.getAppInstance();
 return app;
}