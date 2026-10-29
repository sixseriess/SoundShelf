const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktopApp', {
  platform: process.platform,
  setDiscordSettings: settings => ipcRenderer.invoke('discord:settings', settings),
  updatePresence: payload => ipcRenderer.invoke('discord:presence', payload)
});
