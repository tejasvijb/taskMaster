import { Client } from "pg"


const pgClient = new Client({
  database: "taskmaster",
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: 5432,
  user: process.env.PG_USER,
});

const connectDb = async () => {
  try {
    await pgClient.connect();
    console.log(`PostgreSQL Connected: ${pgClient.host}, ${pgClient.database}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
