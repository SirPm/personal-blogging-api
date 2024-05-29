import mysql2, { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../types/error";
import { ArticleRow, Tag, Article } from "../types/articles";

interface TagRecord extends RowDataPacket, Tag {}

interface ArticleRecord extends RowDataPacket, ArticleRow {}

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pool: Pool = req.app.locals.pool;
  const [validationErr] = validationResult(req)
    .formatWith((err) => err.msg as string)
    .array({ onlyFirstError: true });

  if (validationErr) {
    const err: ApiError = new Error(validationErr);
    err.statusCode = 422;
    return next(err);
  }

  const tags = req.query.tags;

  try {
    const selectArticlesWithTagsSQL = `SELECT articles.*, tags.id AS tag_id, tags.tag FROM articles LEFT JOIN articles_tags ON articles.id = articles_tags.article_id LEFT JOIN tags ON articles_tags.tag_id = tags.id`;
    const [articlesRows] = await pool.execute<ArticleRecord[]>(
      selectArticlesWithTagsSQL
    );

    const uniqueArticles: Map<number, Article> = new Map();
    for (const article of articlesRows) {
      const { id, content, created_at, updated_at, tag_id, tag } = article;
      if (!uniqueArticles.has(id)) {
        uniqueArticles.set(id, {
          id,
          content,
          created_at,
          updated_at,
          tags: [],
        });
      }

      const uniqueArticle = uniqueArticles.get(id);
      if (uniqueArticle) {
        const tags = uniqueArticle.tags;
        tags.push({
          id: tag_id,
          tag,
        });
      }
    }

    const articles = Array.from(uniqueArticles.values());
    res.status(200).json({
      message: "Fetched successfully!",
      articles,
    });
  } catch (error) {
    next(error);
  }
};

const createTables = async (pool: Pool, next: NextFunction) => {
  const connection = await pool.getConnection();
  try {
    const createArticlesTableSQL = `
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    const createTagsTableSQL = `
      CREATE TABLE IF NOT EXISTS tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tag VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createJunctionArticlesTagsTableSQL = `
      CREATE TABLE IF NOT EXISTS articles_tags (
        PRIMARY KEY (article_id, tag_id),
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      )
    `;

    await connection.execute(createArticlesTableSQL);
    await connection.execute(createTagsTableSQL);
    await connection.execute(createJunctionArticlesTagsTableSQL);
  } catch (error) {
    next(error);
    throw error;
  } finally {
    connection.release();
  }
};

const getExistingTags = async (
  pool: Pool,
  tags: string[],
  next: NextFunction
): Promise<{
  oldTagIds: number[];
  oldTagNames: string[];
}> => {
  const connection = await pool.getConnection();
  try {
    const promises = tags.map(async (tagName) => {
      const [tagRows] = await connection.execute<TagRecord[]>(
        `SELECT id, tag FROM tags WHERE tag = "${tagName}"`
      );
      return tagRows;
    });
    const results = await Promise.all(promises);
    const oldTagIds: number[] = [];
    const oldTagNames: string[] = [];

    for (let i = 0; i < results.length; i++) {
      const currentTagRows = results[i];
      if (currentTagRows.length > 0) {
        const [{ id, tag }] = currentTagRows;
        oldTagIds.push(id);
        oldTagNames.push(tag);
      }
    }

    return {
      oldTagIds,
      oldTagNames,
    };
  } catch (error) {
    next(error);
    throw error;
  } finally {
    connection.release();
  }
};

export const createNewArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pool: Pool = req.app.locals.pool;
  const connection = await pool.getConnection();
  const [validationErr] = validationResult(req)
    .formatWith((err) => err.msg as string)
    .array({ onlyFirstError: true });

  if (validationErr) {
    const err: ApiError = new Error(validationErr);
    err.statusCode = 422;
    return next(err);
  }

  const article: string = req.body.article;
  const tags: string[] = req.body.tags
    .split(",")
    .map((tag: string) => tag.trim());

  try {
    await createTables(pool, next);
    await connection.beginTransaction();

    const insertArticleSQL = `INSERT INTO articles (content) VALUES(?)`;
    const [newArticleRow] = await connection.execute<ResultSetHeader>(
      insertArticleSQL,
      [article]
    );
    const articleId = newArticleRow.insertId;

    const { oldTagIds, oldTagNames } = await getExistingTags(pool, tags, next);
    const newTags = tags.filter((tag) => !oldTagNames.includes(tag));
    let newTagIds: number[] = [];
    if (newTags.length > 0) {
      const tagsPlaceholder = newTags.map((_) => "(?)").join(", ");
      const insertTagSQL = `INSERT INTO tags (tag) VALUES ${tagsPlaceholder}`;
      const [newTagsRow] = await connection.execute<ResultSetHeader>(
        insertTagSQL,
        newTags
      );
      const firstTagId = newTagsRow.insertId;
      newTagIds = Array.from(
        { length: newTags.length },
        (_, index) => firstTagId + index
      );
    }

    const articleTags = [...oldTagIds, ...newTagIds].map((tagId) => [
      articleId,
      tagId,
    ]);
    const articlesTagsPlaceholder = tags.map((_) => "(?, ?)").join(", ");
    const insertArticleTagSQL = `INSERT INTO articles_tags (article_id, tag_id) VALUES ${articlesTagsPlaceholder}`;

    await connection.execute(insertArticleTagSQL, articleTags.flat());
    await connection.commit();
    res.status(201).json({
      message: "Article created successfully!",
      data: {
        article,
        tags,
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};
