import { z } from 'zod';
import 'dotenv/config';
const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);
  if (!validationResult.success)
    throw new Error(validationResult.error.message);
  return validationResult.data;
}

export const env = createEnv(process.env);