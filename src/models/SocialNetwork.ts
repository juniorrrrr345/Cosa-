export interface SocialNetwork {
  id: string;
  name: string;
  emoji: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const defaultSocialNetworks: SocialNetwork[] = [
  {
    id: '1',
    name: 'Telegram',
    emoji: '📱',
    url: 'https://t.me/bipcosa06',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    name: 'WhatsApp',
    emoji: '💬',
    url: 'https://wa.me/33123456789',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    name: 'Instagram',
    emoji: '📷',
    url: 'https://instagram.com/bipcosa06',
    isActive: true,
    order: 3
  },
  {
    id: '4',
    name: 'Discord',
    emoji: '🎮',
    url: 'https://discord.gg/bipcosa06',
    isActive: false,
    order: 4
  }
];