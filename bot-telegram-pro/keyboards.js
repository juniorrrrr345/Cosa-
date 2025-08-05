const ConfigManager = require('./config');

class Keyboards {
  // Clavier principal avec réseaux sociaux
  static async getMainKeyboard() {
    const socialNetworks = await ConfigManager.getSocialNetworks();
    const keyboard = [];
    
    // Ajouter les réseaux sociaux par paires
    for (let i = 0; i < socialNetworks.length; i += 2) {
      const row = [];
      row.push({
        text: `${socialNetworks[i].emoji} ${socialNetworks[i].name}`,
        url: socialNetworks[i].url
      });
      
      if (socialNetworks[i + 1]) {
        row.push({
          text: `${socialNetworks[i + 1].emoji} ${socialNetworks[i + 1].name}`,
          url: socialNetworks[i + 1].url
        });
      }
      
      keyboard.push(row);
    }
    
    // Ajouter les boutons d'action
    keyboard.push([
      { text: 'ℹ️ Information', callback_data: 'info' },
      { text: '📊 Statistiques', callback_data: 'stats' }
    ]);
    
    keyboard.push([
      { text: '🔄 Rafraîchir', callback_data: 'refresh' }
    ]);
    
    return {
      inline_keyboard: keyboard
    };
  }

  // Clavier d'administration principal
  static getAdminKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '📝 Message d\'accueil', callback_data: 'admin_welcome' },
          { text: '🖼 Photo d\'accueil', callback_data: 'admin_photo' }
        ],
        [
          { text: '🔗 Réseaux sociaux', callback_data: 'admin_social' },
          { text: 'ℹ️ Texte info', callback_data: 'admin_info' }
        ],
        [
          { text: '📊 Statistiques', callback_data: 'admin_stats' },
          { text: '👥 Utilisateurs', callback_data: 'admin_users' }
        ],
        [
          { text: '📢 Diffusion', callback_data: 'admin_broadcast' },
          { text: '⚙️ Paramètres', callback_data: 'admin_settings' }
        ],
        [
          { text: '🔙 Retour au menu', callback_data: 'start' }
        ]
      ]
    };
  }

  // Clavier de gestion des réseaux sociaux
  static async getSocialManagementKeyboard() {
    const socialNetworks = await ConfigManager.getSocialNetworks();
    const keyboard = [];
    
    // Lister tous les réseaux sociaux avec options
    for (const network of socialNetworks) {
      keyboard.push([
        {
          text: `${network.emoji} ${network.name}`,
          callback_data: `social_view_${network._id}`
        },
        {
          text: '✏️',
          callback_data: `social_edit_${network._id}`
        },
        {
          text: '🗑',
          callback_data: `social_delete_${network._id}`
        }
      ]);
    }
    
    keyboard.push([
      { text: '➕ Ajouter un réseau', callback_data: 'social_add' }
    ]);
    
    keyboard.push([
      { text: '🔙 Retour admin', callback_data: 'admin' }
    ]);
    
    return {
      inline_keyboard: keyboard
    };
  }

  // Clavier de confirmation
  static getConfirmKeyboard(action) {
    return {
      inline_keyboard: [
        [
          { text: '✅ Confirmer', callback_data: `confirm_${action}` },
          { text: '❌ Annuler', callback_data: 'cancel' }
        ]
      ]
    };
  }

  // Clavier de retour
  static getBackKeyboard(destination = 'admin') {
    return {
      inline_keyboard: [
        [
          { text: '🔙 Retour', callback_data: destination }
        ]
      ]
    };
  }

  // Clavier des paramètres
  static getSettingsKeyboard(settings) {
    const keyboard = [
      [
        {
          text: `🔧 Mode maintenance: ${settings.maintenanceMode ? '✅' : '❌'}`,
          callback_data: 'toggle_maintenance'
        }
      ],
      [
        {
          text: `🗑 Suppression auto: ${settings.autoDeleteMessages ? '✅' : '❌'}`,
          callback_data: 'toggle_autodelete'
        }
      ],
      [
        {
          text: `📢 Diffusion: ${settings.broadcastEnabled ? '✅' : '❌'}`,
          callback_data: 'toggle_broadcast'
        }
      ],
      [
        {
          text: `📊 Statistiques: ${settings.statsEnabled ? '✅' : '❌'}`,
          callback_data: 'toggle_stats'
        }
      ],
      [
        { text: '🔄 Réinitialiser config', callback_data: 'reset_config' }
      ],
      [
        { text: '🔙 Retour admin', callback_data: 'admin' }
      ]
    ];
    
    return {
      inline_keyboard: keyboard
    };
  }

  // Clavier de gestion des utilisateurs
  static getUserManagementKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '👥 Liste des utilisateurs', callback_data: 'users_list' },
          { text: '🚫 Utilisateurs bloqués', callback_data: 'users_blocked' }
        ],
        [
          { text: '👑 Administrateurs', callback_data: 'users_admins' },
          { text: '📊 Statistiques users', callback_data: 'users_stats' }
        ],
        [
          { text: '🔍 Rechercher', callback_data: 'users_search' },
          { text: '📤 Exporter', callback_data: 'users_export' }
        ],
        [
          { text: '🔙 Retour admin', callback_data: 'admin' }
        ]
      ]
    };
  }

  // Clavier de pagination
  static getPaginationKeyboard(currentPage, totalPages, prefix) {
    const keyboard = [];
    const row = [];
    
    if (currentPage > 1) {
      row.push({ text: '◀️', callback_data: `${prefix}_page_${currentPage - 1}` });
    }
    
    row.push({ text: `${currentPage}/${totalPages}`, callback_data: 'noop' });
    
    if (currentPage < totalPages) {
      row.push({ text: '▶️', callback_data: `${prefix}_page_${currentPage + 1}` });
    }
    
    if (row.length > 0) {
      keyboard.push(row);
    }
    
    return keyboard;
  }
}

module.exports = Keyboards;