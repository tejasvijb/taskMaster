import express from "express";

import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const apiV1Router = express();

apiV1Router.use("/tasks", taskRoutes);
apiV1Router.use("/users", userRoutes);

export { apiV1Router };
