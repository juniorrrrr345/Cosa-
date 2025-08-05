const mongoose = require('mongoose');

// Schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  isBot: { type: Boolean, default: false },
  languageCode: String,
  isPremium: { type: Boolean, default: false },
  addedToAttachmentMenu: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  messageCount: { type: Number, default: 0 }
});

// Schéma pour la configuration du bot
const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now }
});

// Schéma pour les messages envoyés
const messageSchema = new mongoose.Schema({
  messageId: Number,
  userId: Number,
  text: String,
  date: { type: Date, default: Date.now },
  type: String, // 'user' ou 'bot'
  replyToMessageId: Number
});

// Schéma pour les statistiques
const statsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalUsers: Number,
  activeUsers: Number,
  newUsers: Number,
  messagesReceived: Number,
  messagesSent: Number,
  commandsUsed: Object
});

// Schéma pour les réseaux sociaux
const socialNetworkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  emoji: { type: String, default: '🔗' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

// Création des modèles
const User = mongoose.model('User', userSchema);
const Config = mongoose.model('Config', configSchema);
const Message = mongoose.model('Message', messageSchema);
const Stats = mongoose.model('Stats', statsSchema);
const SocialNetwork = mongoose.model('SocialNetwork', socialNetworkSchema);

module.exports = {
  User,
  Config,
  Message,
  Stats,
  SocialNetwork
};