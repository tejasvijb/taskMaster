import { Pool } from "pg"


export const pgPool = new Pool({
  database: process.env.PG_DATABASE,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: 5432,
  user: process.env.PG_USER,
});

const connectDb = async () => {
  try {
    await pgPool.connect();
    console.log(`PostgreSQL Connected: ${pgPool.options.host}, ${pgPool.options.database}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
