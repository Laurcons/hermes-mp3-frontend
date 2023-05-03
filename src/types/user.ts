export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export enum UserRole {
  admin = 'admin',
  volunteer = 'volunteer',
}
