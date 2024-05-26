import { Router } from "express";
import { createNewArticle, getArticles } from "../controllers/articles";

const articlesRouter = Router();

articlesRouter.get("/all", getArticles);

articlesRouter.post("/create", createNewArticle);

export { articlesRouter };
