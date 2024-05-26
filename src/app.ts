import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { createConnectionPool } from "./utils/db";
import { articlesRouter } from "./routes/articles";
import { errorHandler, notFoundErrorHandler } from "./utils/error-handler";

dotenv.config();
const PORT = process.env.PORT || 4000;

const connectionPool = createConnectionPool();
const app = express();

app.locals.connectionPool = connectionPool;

app.use(bodyParser.json());
app.use("/articles", articlesRouter);

app.use(errorHandler);
app.use(notFoundErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
