import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
if (
    !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_HOST || !DATABASE_PORT ||
    !DATABASE_NAME
) {
    throw new Error(
        "Missing required environment variables for database connection",
    );
}

export default defineConfig({
    out: "./migrations",
    schema: "./src/services/db-migrations-service/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    },
});
