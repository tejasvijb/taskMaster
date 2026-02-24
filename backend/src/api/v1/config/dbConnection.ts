import { Pool, QueryResult, QueryResultRow } from "pg";

export const pool = new Pool({
  database: process.env.PG_DATABASE,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: 5432,
  user: process.env.PG_USER,
});

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};


const connectDb = async () => {
  try {
    await pool.connect();
    console.log(`PostgreSQL Connected: ${pool.options.host}, ${pool.options.database}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
