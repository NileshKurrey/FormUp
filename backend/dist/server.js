import http from 'http';
import { myapp } from './src/index.js';
import { env } from './src/shared/utils/env/env.js';
import dotenv from 'dotenv';
dotenv.config();
async function init() {
    const app = await myapp();
    try {
        const server = http.createServer(app);
        const PORT = +(env.PORT ?? 3000);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
    }
}
init();
//# sourceMappingURL=server.js.map