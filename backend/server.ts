import http from 'http';
import { myapp } from './src/index.js';
import { env } from './src/shared/utils/env/env.js';
import type { ILoggerRepository } from './src/domain/repositories/IloggerRepositry.js';

async function init() {
  const { app, container } = await myapp();  // ✅ single container
  const logger: ILoggerRepository = container.logger;

  try {
    const server = http.createServer(app);
    const PORT: number = +(env.PORT ?? 3000);

    server.listen(PORT, () => {
      logger.info(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Error starting server:", error);
  }
}

init();

