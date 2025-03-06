// Zod check for env variable

import dotenv from "dotenv";
import { z } from "zod";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const configSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  ALLOWED_ORIGINS: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  CLIENT_URL: z.string(),
});

const envVars = configSchema.parse(process.env);

export const PORT = envVars.PORT;
export const DATABASE_URL = envVars.DATABASE_URL;
export const JWT_SECRET = envVars.JWT_SECRET;
export const CLOUDINARY_CLOUD_NAME = envVars.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = envVars.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = envVars.CLOUDINARY_API_SECRET;
export const ALLOWED_ORIGINS = envVars.ALLOWED_ORIGINS;
export const EMAIL_USER = envVars.EMAIL_USER;
export const EMAIL_PASSWORD = envVars.EMAIL_PASSWORD;
export const CLIENT_URL = envVars.CLIENT_URL;
