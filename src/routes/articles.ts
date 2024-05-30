import { Router } from "express";
import { body, query } from "express-validator";
import {
  createNewArticle,
  getArticles,
  getArticle,
  updateArticle,
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

articlesRouter.put(
  "/single/update/:articleId",
  [
    body("article")
      .trim()
      .exists()
      .notEmpty()
      .withMessage(
        "No article to update! Enter the new article to update with!"
      ),
    // body("tags")
    //   .optional()
    //   .trim()
    //   .notEmpty()
    //   .withMessage("Tags cannot be empty"),
  ],
  updateArticle
);

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
