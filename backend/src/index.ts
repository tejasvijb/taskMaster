import express from "express";
import morgan from "morgan";

import connectDb from "./api/v1/config/dbConnection.js";
import { apiV1Router } from "./api/v1/index.js";
import { errorHandler } from "./api/v1/middleware/errorHandleer.js";

const app = express();

connectDb();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", apiV1Router);


app.use(errorHandler)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
