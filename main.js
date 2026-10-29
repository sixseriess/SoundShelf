const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
let discordClient = null;
let discordAppId = null;

async function setDiscordSettings(enabled, appId) {
  if (!enabled || !appId) {
    if (discordClient) { try { discordClient.destroy(); } catch {} }
    discordClient = null; discordAppId = null;
    return { ok: true, message: enabled ? 'Add a Discord Application ID to enable Rich Presence.' : 'Discord Rich Presence is off.' };
  }
  try {
    const RPC = require('discord-rpc');
    if (discordClient && discordAppId !== appId) { try { discordClient.destroy(); } catch {} discordClient = null; }
    if (!discordClient) {
      discordAppId = appId;
      discordClient = new RPC.Client({ transport: 'ipc' });
      await discordClient.login({ clientId: appId });
    }
    return { ok: true, message: 'Connected to Discord Rich Presence.' };
  } catch (error) {
    discordClient = null;
    return { ok: false, message: 'Could not connect. Keep Discord desktop open and verify the Application ID.' };
  }
}

ipcMain.handle('discord:settings', async (_event, settings) => setDiscordSettings(!!settings.enabled, String(settings.appId || '').trim()));
ipcMain.handle('discord:presence', async (_event, payload) => {
  if (!payload.enabled || !payload.appId || !payload.title) return { ok: false };
  const result = await setDiscordSettings(true, String(payload.appId));
  if (!result.ok || !discordClient) return result;
  try {
    const activity = {
      details: payload.title.slice(0, 128),
      state: (payload.artist || 'SoundShelf').slice(0, 128),
      largeImageKey: 'soundshelf',
      largeImageText: 'SoundShelf',
      type: 2,
      instance: false
    };
    if (payload.playing) activity.startTimestamp = Date.now();
    await discordClient.setActivity(activity);
    return { ok: true };
  } catch { return { ok: false, message: 'Discord presence could not be updated.' }; }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1380, height: 900, minWidth: 980, minHeight: 650,
    backgroundColor: '#0b0b0d', title: 'SoundShelf',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile('index.html');
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('file://')) shell.openExternal(url);
    return { action: 'deny' };
  });
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('before-quit', () => { if (discordClient) { try { discordClient.destroy(); } catch {} } });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
