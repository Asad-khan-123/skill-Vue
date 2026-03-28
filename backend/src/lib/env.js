import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT : process.env.PORT,
  DB_URL : process.env.DB_URL,
  NODE_ENV : process.env.NODE_ENV,
  CLIENT_URL:process.env.CLIENT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET
}
