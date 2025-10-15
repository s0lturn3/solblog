export interface AttachmentDTO {
  id: string;
  post_id: number;
  filename: string;
  mime: string;
  size: number;
  storage_key_or_url: any;
  hash: any;
  uploaded_at: Date;
  updated_at: Date;
}