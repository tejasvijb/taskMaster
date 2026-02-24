import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import connectDb from "./api/v1/config/dbConnection.js";
import { apiV1Router } from "./api/v1/index.js";
import { errorHandler } from "./api/v1/middleware/errorHandleer.js";

const app = express();

connectDb();

const corsOptions = {
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, // Allow cookies to be sent
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin: process.env.FRONTEND_URL, // Replace with your frontend's domain
};

// use dot env

// Add middleware for handling CORS requests from index.html

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
