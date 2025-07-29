export interface SocialNetwork {
  id: string;
  name: string;
  emoji: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
}