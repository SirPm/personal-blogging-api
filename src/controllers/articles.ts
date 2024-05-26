import mysql2, { Pool } from "mysql2/promise";
import { Request, Response, NextFunction } from "express";

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const connectionPool: Pool = req.app.locals.connectionPool;
  try {
    const [articles] = await connectionPool.execute(`SELECT * FROM Articles`);
    res.status(200).json({
      message: "Fetched successfully!",
      articles,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const connectionPool: Pool = req.app.locals.connectionPool;
  const article = req.body.article;
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS Articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await connectionPool.execute(createTableSQL);
    const insertSQL = `INSERT INTO Articles (content) VALUES(?)`;
    const insertValue = [article];
    await connectionPool.execute(insertSQL, insertValue);
    res.status(201).json({
      message: "Article created successfully!",
      article,
    });
  } catch (error) {
    next(error);
  }
};
