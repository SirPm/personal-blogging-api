import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { createPool } from "./utils/db";
import { articlesRouter } from "./routes/articles";
import { errorHandler, notFoundErrorHandler } from "./utils/error-handler";

dotenv.config();
const PORT = process.env.PORT || 4000;

const pool = createPool();
const app = express();

app.locals.pool = pool;

app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  next();
});
app.use("/articles", articlesRouter);

app.use(errorHandler);
app.use(notFoundErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
