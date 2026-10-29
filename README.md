# SoundShelf — Windows desktop music player

A Liner-inspired desktop starter with a local music library, playlists, link importing, album art, and lyric lookup.

## Run it
1. Install **Node.js LTS** from https://nodejs.org/
2. Extract this folder.
3. Open PowerShell in this folder and run:
   ```powershell
   npm install
   npm start
   ```
4. To build a Windows installer:
   ```powershell
   npm run dist
   ```
   The Windows setup installer will be created in `dist/` (named something like `SoundShelf Setup 1.0.0.exe`). Run that installer and follow the setup prompts.

## What works
- Save music links from YouTube, Spotify, SoundCloud, Apple Music, Deezer, Tidal and other services.
- Local library persistence using browser storage.
- Liked Songs and custom playlists.
- YouTube playback inside the app for supported public videos.
- Song title / artist lookup from YouTube video metadata when available.
- LRC synced lyric lookup through LRCLIB when a matching track is available.
- Open links in their original music service when embedded playback isn't supported.

## Playback limitations
A link is not the same as a playable audio file. Spotify, Apple Music and other services restrict full-track playback to their own apps or approved integrations. SoundShelf does not bypass DRM, subscriptions, region restrictions, or platform restrictions. For those links it stores the song and opens the original service. YouTube embeds may be unavailable for some videos or in some regions.

## Privacy
Your saved library and playlists are stored locally on this Windows user profile. Link metadata and lyric lookup require an internet connection. No account or server is included in this starter.
