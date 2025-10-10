//o objetivo deste arquivo é criar a variavel pool
//e colocar dentro dela a conexão com o postgers
//estamos assim criando um mini pacote
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});