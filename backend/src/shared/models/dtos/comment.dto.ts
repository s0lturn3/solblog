export interface CommentDTO {
  id: string;
  post_id: number;
  author_id?: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  is_approved: boolean;
  parent_id?: string;
}
