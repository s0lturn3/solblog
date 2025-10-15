export interface ReactionDTO {
  id: string;
  post_id: number;
  user_id?: string;
  emoji: string; // or enum if you want to restrict
  created_at: Date;
}