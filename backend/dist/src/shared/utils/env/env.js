import { z } from 'zod';
const envSchema = z.object({
    PORT: z.string().optional(),
});
function createEnv(env) {
    const validationResult = envSchema.safeParse(env);
    if (!validationResult.success)
        throw new Error(validationResult.error.message);
    console.log('Environment variables validated successfully.');
    return validationResult.data;
}
export const env = createEnv(process.env);
//# sourceMappingURL=env.js.map