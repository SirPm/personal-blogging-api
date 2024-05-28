import mysql2, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const createPool = (): Pool => {
  const pool = mysql2.createPool({
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PW || "",
  });
  return pool;
};
