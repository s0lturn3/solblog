export interface UserDTO {
  id: string;
  username: string;
  email: string;
  hashed_password: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}

export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  READER = 'READER',
  COMMENTER = 'COMMENTER'
}