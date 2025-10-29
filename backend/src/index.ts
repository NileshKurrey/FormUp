// src/index.js
import userRoutes from './app/routes/UserRoutes.js';
import { createServiceContainer } from './infra/di/container.js';
import type { Request, Response } from 'express';

export const myapp = async function() {
  const container = createServiceContainer();
  const routers = container.app;

  routers.use("/api/v1/users", userRoutes);
  routers.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to FormUp API');
  });

  return {
    app: container.app.getAppInstance(),
    container
  };
};
