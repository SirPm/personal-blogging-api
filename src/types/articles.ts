export interface ArticleRow {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  tag_id: number;
  tag: string;
}

export interface Tag {
  id: number;
  tag: string;
}

export interface Article {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}
