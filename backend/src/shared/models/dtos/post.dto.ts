export interface PostDTO {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  body_markdown: string;
  rendered_html: string;
  status: PostStatus;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  is_private: boolean;
  author_id: string;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}