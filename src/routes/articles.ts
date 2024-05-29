import { Router } from "express";
import { body, query } from "express-validator";
import {
  createNewArticle,
  getArticles,
  getArticle,
} from "../controllers/articles";

const articlesRouter = Router();

articlesRouter.get(
  "/all",
  [
    query("tags")
      .optional()
      .isString()
      .withMessage("Tags must be a comma separated string"),
  ],
  getArticles
);

articlesRouter.get("/single/:articleId", getArticle);

articlesRouter.post(
  "/create",
  [
    body("article")
      .trim()
      .notEmpty()
      .withMessage("Article is compulsory!")
      .isLength({ min: 5 })
      .withMessage("Article must be greater than 5 characters"),
    body("tags").trim().notEmpty().withMessage("Tags are compulsory!"),
  ],
  createNewArticle
);

export { articlesRouter };
