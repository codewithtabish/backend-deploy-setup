import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(
  process.env.DRIZZLE_DATABASE_URL! ||
    "postgresql://neondb_owner:KkR56pfzhuiW@ep-aged-bush-a5rcr5e6.us-east-2.aws.neon.tech/backend-courses?sslmode=require"
);
export const db = drizzle(sql);
