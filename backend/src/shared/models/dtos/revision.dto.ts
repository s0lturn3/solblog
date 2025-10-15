export interface RevisionDTO {
  id: any;
  post_id: number;
  author_id: string;
  diff: string;
  full_body: string;
  created_at: Date;
  updated_at: Date;
}