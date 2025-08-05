require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const express = require('express');
const { User, Message, Stats } = require('./models');
const ConfigManager = require('./config');
const Keyboards = require('./keyboards');

// Configuration
const token = process.env.BOT_TOKEN;
const adminId = parseInt(process.env.ADMIN_ID);
const mongoUri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const webhookUrl = process.env.WEBHOOK_URL;
const isProduction = process.env.NODE_ENV === 'production';

// Vérification des variables d'environnement
if (!token || !adminId || !mongoUri) {
  console.error('❌ Variables d\'environnement manquantes!');
  console.error('Assurez-vous d\'avoir défini: BOT_TOKEN, ADMIN_ID, MONGODB_URI');
  process.exit(1);
}

// Initialisation du bot
const bot = new TelegramBot(token, { 
  polling: !isProduction,
  webHook: isProduction ? { port } : false
});

// Configuration du webhook en production
if (isProduction && webhookUrl) {
  bot.setWebHook(`${webhookUrl}/bot${token}`);
}

// Serveur Express pour le webhook
const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot Telegram Professionnel est en ligne! 🚀');
});

// État global pour les sessions utilisateur
const userSessions = new Map();

// Connexion à MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connecté à MongoDB');
  await ConfigManager.initialize();
  
  // Créer l'admin principal
  await User.findOneAndUpdate(
    { userId: adminId },
    { isAdmin: true },
    { upsert: true }
  );
}).catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
  process.exit(1);
});

// Middleware pour vérifier l'utilisateur
async function checkUser(msg) {
  const userId = msg.from.id;
  
  try {
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = await User.create({
        userId,
        username: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        isBot: msg.from.is_bot,
        languageCode: msg.from.language_code,
        isPremium: msg.from.is_premium || false,
        addedToAttachmentMenu: msg.from.added_to_attachment_menu || false
      });
      
      // Mettre à jour les stats
      await updateStats('newUsers', 1);
    } else {
      // Mettre à jour la dernière activité
      user.lastActive = new Date();
      user.messageCount += 1;
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Erreur checkUser:', error);
    return null;
  }
}

// Middleware pour vérifier si l'utilisateur est admin
async function isAdmin(userId) {
  const user = await User.findOne({ userId });
  return user && user.isAdmin;
}

// Fonction pour supprimer les anciens messages
async function deleteOldMessages(chatId, keepMessageId) {
  const session = userSessions.get(chatId) || { messages: [] };
  
  for (const msgId of session.messages) {
    if (msgId !== keepMessageId) {
      try {
        await bot.deleteMessage(chatId, msgId);
      } catch (error) {
        // Ignorer les erreurs de suppression
      }
    }
  }
  
  session.messages = keepMessageId ? [keepMessageId] : [];
  userSessions.set(chatId, session);
}

// Fonction pour envoyer un message avec suppression automatique
async function sendMessageWithCleanup(chatId, text, options = {}) {
  const autoDelete = await ConfigManager.get('autoDeleteMessages');
  
  if (autoDelete) {
    await deleteOldMessages(chatId);
  }
  
  const message = await bot.sendMessage(chatId, text, options);
  
  if (autoDelete) {
    const session = userSessions.get(chatId) || { messages: [] };
    session.messages.push(message.message_id);
    userSessions.set(chatId, session);
  }
  
  return message;
}

// Fonction pour envoyer une photo avec suppression automatique
async function sendPhotoWithCleanup(chatId, photo, options = {}) {
  const autoDelete = await ConfigManager.get('autoDeleteMessages');
  
  if (autoDelete) {
    await deleteOldMessages(chatId);
  }
  
  const message = await bot.sendPhoto(chatId, photo, options);
  
  if (autoDelete) {
    const session = userSessions.get(chatId) || { messages: [] };
    session.messages.push(message.message_id);
    userSessions.set(chatId, session);
  }
  
  return message;
}

// Fonction pour mettre à jour les statistiques
async function updateStats(field, increment = 1) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  await Stats.findOneAndUpdate(
    { date: today },
    { $inc: { [field]: increment } },
    { upsert: true }
  );
}

// Commande /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await checkUser(msg);
  
  if (!user) {
    await bot.sendMessage(chatId, '❌ Erreur lors de l\'initialisation. Veuillez réessayer.');
    return;
  }
  
  // Vérifier le mode maintenance
  const maintenanceMode = await ConfigManager.get('maintenanceMode');
  if (maintenanceMode && !user.isAdmin) {
    const maintenanceMessage = await ConfigManager.get('maintenanceMessage');
    await bot.sendMessage(chatId, maintenanceMessage);
    return;
  }
  
  // Récupérer le message et la photo d'accueil
  let welcomeMessage = await ConfigManager.get('welcomeMessage');
  const welcomePhoto = await ConfigManager.get('welcomePhoto');
  
  // Remplacer les variables dans le message
  welcomeMessage = welcomeMessage.replace('{firstname}', user.firstName || 'Utilisateur');
  
  // Obtenir le clavier principal
  const keyboard = await Keyboards.getMainKeyboard();
  
  // Envoyer le message d'accueil (sans suppression automatique)
  if (welcomePhoto) {
    await bot.sendPhoto(chatId, welcomePhoto, {
      caption: welcomeMessage,
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  } else {
    await bot.sendMessage(chatId, welcomeMessage, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }
  
  await updateStats('commandsUsed.start', 1);
});

// Commande /admin
bot.onText(/\/admin/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!await isAdmin(userId)) {
    await sendMessageWithCleanup(chatId, '❌ Accès refusé. Cette commande est réservée aux administrateurs.');
    return;
  }
  
  await sendMessageWithCleanup(chatId, '👨‍💼 *Panel d\'administration*\n\nQue souhaitez-vous faire?', {
    reply_markup: Keyboards.getAdminKeyboard(),
    parse_mode: 'Markdown'
  });
  
  await updateStats('commandsUsed.admin', 1);
});

// Gestionnaire des callback queries
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;
  const userId = query.from.id;
  
  await bot.answerCallbackQuery(query.id);
  
  // Vérifier l'utilisateur
  const user = await checkUser(query);
  if (!user) return;
  
  // Commandes publiques
  switch (data) {
    case 'start':
    case 'refresh':
      const welcomeMessage = (await ConfigManager.get('welcomeMessage')).replace('{firstname}', user.firstName || 'Utilisateur');
      const welcomePhoto = await ConfigManager.get('welcomePhoto');
      const keyboard = await Keyboards.getMainKeyboard();
      
      if (welcomePhoto) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendPhoto(chatId, welcomePhoto, {
          caption: welcomeMessage,
          reply_markup: keyboard,
          parse_mode: 'HTML'
        });
      } else {
        await bot.editMessageText(welcomeMessage, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: keyboard,
          parse_mode: 'HTML'
        });
      }
      break;
      
    case 'info':
      const infoText = await ConfigManager.get('infoText');
      await bot.editMessageText(infoText, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: Keyboards.getBackKeyboard('start'),
        parse_mode: 'HTML'
      });
      break;
      
    case 'stats':
      const statsEnabled = await ConfigManager.get('statsEnabled');
      if (!statsEnabled) {
        await bot.answerCallbackQuery(query.id, {
          text: '📊 Les statistiques sont désactivées',
          show_alert: true
        });
        return;
      }
      
      const totalUsers = await User.countDocuments();
      const activeToday = await User.countDocuments({
        lastActive: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      
      const statsText = `📊 *Statistiques du bot*\n\n` +
        `👥 Total utilisateurs: ${totalUsers}\n` +
        `🟢 Actifs aujourd'hui: ${activeToday}\n` +
        `🤖 Version: 1.0.0\n` +
        `⏰ Uptime: ${process.uptime().toFixed(0)}s`;
      
      await bot.editMessageText(statsText, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: Keyboards.getBackKeyboard('start'),
        parse_mode: 'Markdown'
      });
      break;
  }
  
  // Commandes admin
  if (!await isAdmin(userId)) return;
  
  switch (data) {
    case 'admin':
      await bot.editMessageText('👨‍💼 *Panel d\'administration*\n\nQue souhaitez-vous faire?', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: Keyboards.getAdminKeyboard(),
        parse_mode: 'Markdown'
      });
      break;
      
    case 'admin_welcome':
      const currentWelcome = await ConfigManager.get('welcomeMessage');
      await bot.editMessageText(
        `📝 *Message d\'accueil actuel:*\n\n${currentWelcome}\n\n` +
        `Pour modifier, envoyez le nouveau message.\n` +
        `Utilisez {firstname} pour le prénom de l'utilisateur.`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin'),
          parse_mode: 'Markdown'
        }
      );
      
      // Définir l'état de l'utilisateur
      const session = userSessions.get(chatId) || {};
      session.waitingFor = 'welcome_message';
      userSessions.set(chatId, session);
      break;
      
    case 'admin_photo':
      await bot.editMessageText(
        `🖼 *Photo d\'accueil*\n\n` +
        `Pour définir une nouvelle photo, envoyez-la maintenant.\n` +
        `Pour supprimer la photo actuelle, envoyez /removephoto`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin'),
          parse_mode: 'Markdown'
        }
      );
      
      const photoSession = userSessions.get(chatId) || {};
      photoSession.waitingFor = 'welcome_photo';
      userSessions.set(chatId, photoSession);
      break;
      
    case 'admin_social':
      const socialKeyboard = await Keyboards.getSocialManagementKeyboard();
      await bot.editMessageText(
        `🔗 *Gestion des réseaux sociaux*\n\n` +
        `Cliquez sur un réseau pour le gérer:`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: socialKeyboard,
          parse_mode: 'Markdown'
        }
      );
      break;
      
    case 'admin_info':
      const currentInfo = await ConfigManager.get('infoText');
      await bot.editMessageText(
        `ℹ️ *Texte d\'information actuel:*\n\n${currentInfo}\n\n` +
        `Pour modifier, envoyez le nouveau texte.`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin'),
          parse_mode: 'Markdown'
        }
      );
      
      const infoSession = userSessions.get(chatId) || {};
      infoSession.waitingFor = 'info_text';
      userSessions.set(chatId, infoSession);
      break;
      
    case 'admin_stats':
      const stats = await Stats.find().sort('-date').limit(7);
      const users = await User.countDocuments();
      const admins = await User.countDocuments({ isAdmin: true });
      const blocked = await User.countDocuments({ isBlocked: true });
      
      let statsReport = `📊 *Statistiques détaillées*\n\n`;
      statsReport += `👥 Total utilisateurs: ${users}\n`;
      statsReport += `👑 Administrateurs: ${admins}\n`;
      statsReport += `🚫 Bloqués: ${blocked}\n\n`;
      
      if (stats.length > 0) {
        statsReport += `*7 derniers jours:*\n`;
        stats.forEach(stat => {
          const date = stat.date.toLocaleDateString();
          statsReport += `\n📅 ${date}\n`;
          statsReport += `• Nouveaux: ${stat.newUsers || 0}\n`;
          statsReport += `• Messages: ${stat.messagesReceived || 0}\n`;
        });
      }
      
      await bot.editMessageText(statsReport, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: Keyboards.getBackKeyboard('admin'),
        parse_mode: 'Markdown'
      });
      break;
      
    case 'admin_users':
      await bot.editMessageText(
        `👥 *Gestion des utilisateurs*\n\n` +
        `Sélectionnez une option:`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getUserManagementKeyboard(),
          parse_mode: 'Markdown'
        }
      );
      break;
      
    case 'admin_broadcast':
      const broadcastEnabled = await ConfigManager.get('broadcastEnabled');
      if (!broadcastEnabled) {
        await bot.answerCallbackQuery(query.id, {
          text: '❌ La diffusion est désactivée',
          show_alert: true
        });
        return;
      }
      
      await bot.editMessageText(
        `📢 *Diffusion de message*\n\n` +
        `Envoyez le message à diffuser à tous les utilisateurs.\n` +
        `Vous pouvez envoyer du texte, des photos, des vidéos, etc.`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin'),
          parse_mode: 'Markdown'
        }
      );
      
      const broadcastSession = userSessions.get(chatId) || {};
      broadcastSession.waitingFor = 'broadcast_message';
      userSessions.set(chatId, broadcastSession);
      break;
      
    case 'admin_settings':
      const settings = await ConfigManager.getAll();
      await bot.editMessageText(
        `⚙️ *Paramètres du bot*\n\n` +
        `Cliquez sur un paramètre pour le modifier:`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getSettingsKeyboard(settings),
          parse_mode: 'Markdown'
        }
      );
      break;
      
    // Gestion des toggles
    case 'toggle_maintenance':
      const currentMaintenance = await ConfigManager.get('maintenanceMode');
      await ConfigManager.set('maintenanceMode', !currentMaintenance);
      const updatedSettings = await ConfigManager.getAll();
      await bot.editMessageReplyMarkup(
        Keyboards.getSettingsKeyboard(updatedSettings),
        { chat_id: chatId, message_id: messageId }
      );
      break;
      
    case 'toggle_autodelete':
      const currentAutoDelete = await ConfigManager.get('autoDeleteMessages');
      await ConfigManager.set('autoDeleteMessages', !currentAutoDelete);
      const updatedSettings2 = await ConfigManager.getAll();
      await bot.editMessageReplyMarkup(
        Keyboards.getSettingsKeyboard(updatedSettings2),
        { chat_id: chatId, message_id: messageId }
      );
      break;
      
    case 'toggle_broadcast':
      const currentBroadcast = await ConfigManager.get('broadcastEnabled');
      await ConfigManager.set('broadcastEnabled', !currentBroadcast);
      const updatedSettings3 = await ConfigManager.getAll();
      await bot.editMessageReplyMarkup(
        Keyboards.getSettingsKeyboard(updatedSettings3),
        { chat_id: chatId, message_id: messageId }
      );
      break;
      
    case 'toggle_stats':
      const currentStats = await ConfigManager.get('statsEnabled');
      await ConfigManager.set('statsEnabled', !currentStats);
      const updatedSettings4 = await ConfigManager.getAll();
      await bot.editMessageReplyMarkup(
        Keyboards.getSettingsKeyboard(updatedSettings4),
        { chat_id: chatId, message_id: messageId }
      );
      break;
      
    case 'reset_config':
      await bot.editMessageText(
        `⚠️ *Réinitialiser la configuration?*\n\n` +
        `Cette action va restaurer tous les paramètres par défaut.`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getConfirmKeyboard('reset_config'),
          parse_mode: 'Markdown'
        }
      );
      break;
      
    case 'confirm_reset_config':
      await ConfigManager.reset();
      await bot.editMessageText(
        `✅ Configuration réinitialisée avec succès!`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin_settings'),
          parse_mode: 'Markdown'
        }
      );
      break;
      
    case 'cancel':
      await bot.editMessageText(
        `❌ Action annulée`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin'),
          parse_mode: 'Markdown'
        }
      );
      break;
      
    // Gestion des utilisateurs
    case 'users_list':
      const usersList = await User.find().sort('-joinedAt').limit(10);
      let usersText = `👥 *Derniers utilisateurs:*\n\n`;
      
      usersList.forEach(u => {
        usersText += `${u.isAdmin ? '👑' : '👤'} ${u.firstName || 'Sans nom'} `;
        usersText += `(@${u.username || 'sans_username'})\n`;
        usersText += `ID: \`${u.userId}\`\n`;
        usersText += `Inscrit: ${u.joinedAt.toLocaleDateString()}\n\n`;
      });
      
      await bot.editMessageText(usersText, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: Keyboards.getBackKeyboard('admin_users'),
        parse_mode: 'Markdown'
      });
      break;
      
    case 'users_stats':
      const totalUsersCount = await User.countDocuments();
      const todayUsers = await User.countDocuments({
        joinedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      const weekUsers = await User.countDocuments({
        joinedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      const monthUsers = await User.countDocuments({
        joinedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      
      const userStatsText = `📊 *Statistiques utilisateurs*\n\n` +
        `👥 Total: ${totalUsersCount}\n` +
        `📅 Aujourd'hui: +${todayUsers}\n` +
        `📅 Cette semaine: +${weekUsers}\n` +
        `📅 Ce mois: +${monthUsers}\n\n` +
        `📈 Croissance moyenne: ${(weekUsers / 7).toFixed(1)} users/jour`;
      
      await bot.editMessageText(userStatsText, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: Keyboards.getBackKeyboard('admin_users'),
        parse_mode: 'Markdown'
      });
      break;
      
    // Ajout de réseau social
    case 'social_add':
      await bot.editMessageText(
        `➕ *Ajouter un réseau social*\n\n` +
        `Envoyez les informations dans ce format:\n` +
        `Nom | URL | Emoji\n\n` +
        `Exemple: Instagram | https://instagram.com/username | 📸`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: Keyboards.getBackKeyboard('admin_social'),
          parse_mode: 'Markdown'
        }
      );
      
      const addSocialSession = userSessions.get(chatId) || {};
      addSocialSession.waitingFor = 'add_social';
      userSessions.set(chatId, addSocialSession);
      break;
  }
  
  // Gestion des réseaux sociaux (edit/delete)
  if (data.startsWith('social_delete_')) {
    const networkId = data.replace('social_delete_', '');
    await ConfigManager.deleteSocialNetwork(networkId);
    
    const socialKeyboard = await Keyboards.getSocialManagementKeyboard();
    await bot.editMessageText(
      `✅ Réseau social supprimé!\n\n` +
      `🔗 *Gestion des réseaux sociaux*`,
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: socialKeyboard,
        parse_mode: 'Markdown'
      }
    );
  }
});

// Gestionnaire des messages texte
bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return; // Ignorer les commandes
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const session = userSessions.get(chatId) || {};
  
  // Vérifier si l'utilisateur est admin pour les actions d'attente
  if (session.waitingFor && await isAdmin(userId)) {
    switch (session.waitingFor) {
      case 'welcome_message':
        if (msg.text) {
          await ConfigManager.set('welcomeMessage', msg.text);
          await sendMessageWithCleanup(chatId, 
            `✅ Message d'accueil mis à jour!`,
            { reply_markup: Keyboards.getBackKeyboard('admin') }
          );
          session.waitingFor = null;
          userSessions.set(chatId, session);
        }
        break;
        
      case 'welcome_photo':
        if (msg.photo) {
          const photoId = msg.photo[msg.photo.length - 1].file_id;
          await ConfigManager.set('welcomePhoto', photoId);
          await sendMessageWithCleanup(chatId, 
            `✅ Photo d'accueil mise à jour!`,
            { reply_markup: Keyboards.getBackKeyboard('admin') }
          );
          session.waitingFor = null;
          userSessions.set(chatId, session);
        }
        break;
        
      case 'info_text':
        if (msg.text) {
          await ConfigManager.set('infoText', msg.text);
          await sendMessageWithCleanup(chatId, 
            `✅ Texte d'information mis à jour!`,
            { reply_markup: Keyboards.getBackKeyboard('admin') }
          );
          session.waitingFor = null;
          userSessions.set(chatId, session);
        }
        break;
        
      case 'add_social':
        if (msg.text) {
          const parts = msg.text.split('|').map(p => p.trim());
          if (parts.length >= 2) {
            const [name, url, emoji = '🔗'] = parts;
            await ConfigManager.addSocialNetwork(name, url, emoji);
            
            const socialKeyboard = await Keyboards.getSocialManagementKeyboard();
            await sendMessageWithCleanup(chatId, 
              `✅ Réseau social ajouté!\n\n🔗 *Gestion des réseaux sociaux*`,
              { 
                reply_markup: socialKeyboard,
                parse_mode: 'Markdown'
              }
            );
          } else {
            await sendMessageWithCleanup(chatId, 
              `❌ Format incorrect. Utilisez: Nom | URL | Emoji`
            );
          }
          session.waitingFor = null;
          userSessions.set(chatId, session);
        }
        break;
        
      case 'broadcast_message':
        // Diffuser le message à tous les utilisateurs
        const users = await User.find({ isBlocked: false });
        let sent = 0;
        let failed = 0;
        
        await sendMessageWithCleanup(chatId, 
          `📤 Diffusion en cours... 0/${users.length}`
        );
        
        for (const user of users) {
          try {
            if (msg.text) {
              await bot.sendMessage(user.userId, msg.text);
            } else if (msg.photo) {
              await bot.sendPhoto(user.userId, msg.photo[msg.photo.length - 1].file_id, {
                caption: msg.caption
              });
            } else if (msg.video) {
              await bot.sendVideo(user.userId, msg.video.file_id, {
                caption: msg.caption
              });
            }
            sent++;
          } catch (error) {
            failed++;
            if (error.response && error.response.statusCode === 403) {
              // L'utilisateur a bloqué le bot
              await User.findOneAndUpdate(
                { userId: user.userId },
                { isBlocked: true }
              );
            }
          }
          
          // Mettre à jour le progress tous les 10 utilisateurs
          if ((sent + failed) % 10 === 0) {
            await bot.editMessageText(
              `📤 Diffusion en cours... ${sent + failed}/${users.length}\n` +
              `✅ Envoyés: ${sent}\n` +
              `❌ Échecs: ${failed}`,
              { chat_id: chatId, message_id: msg.message_id + 1 }
            );
          }
        }
        
        await sendMessageWithCleanup(chatId, 
          `✅ Diffusion terminée!\n\n` +
          `📊 Résultats:\n` +
          `✅ Envoyés: ${sent}\n` +
          `❌ Échecs: ${failed}`,
          { reply_markup: Keyboards.getBackKeyboard('admin') }
        );
        
        session.waitingFor = null;
        userSessions.set(chatId, session);
        break;
    }
  }
  
  // Enregistrer le message
  if (msg.text) {
    await Message.create({
      messageId: msg.message_id,
      userId: msg.from.id,
      text: msg.text,
      type: 'user'
    });
    
    await updateStats('messagesReceived', 1);
  }
});

// Commande pour supprimer la photo
bot.onText(/\/removephoto/, async (msg) => {
  const userId = msg.from.id;
  
  if (!await isAdmin(userId)) {
    return;
  }
  
  await ConfigManager.set('welcomePhoto', null);
  await sendMessageWithCleanup(msg.chat.id, 
    `✅ Photo d'accueil supprimée!`,
    { reply_markup: Keyboards.getBackKeyboard('admin') }
  );
});

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.error('Erreur de polling:', error);
});

bot.on('webhook_error', (error) => {
  console.error('Erreur de webhook:', error);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
  console.log(`🤖 Bot @${bot.options.username || 'telegram_bot'} est en ligne!`);
  console.log(`📊 Mode: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`🔗 Webhook: ${isProduction ? 'Activé' : 'Désactivé (Polling)'}`);
});

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
  console.log('\n👋 Arrêt du bot...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = { bot, app };