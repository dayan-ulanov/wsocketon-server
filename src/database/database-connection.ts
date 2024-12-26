import * as dotenv from 'dotenv';
dotenv.config();

export const SECRET = process.env.SECRET_KEY;

export const DATABASE_CONNECTION = 'database_connection';
