import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

//Creates a SQL-connection using project DB URL
export const sql = neon(process.env.DATABASE_URL);
