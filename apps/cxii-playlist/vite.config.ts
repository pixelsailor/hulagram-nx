import { defineConfig } from "vite";
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const PATH_TO_PLAYLIST_PLUGIN = '../../docker/wordpress/web/app/plugins/cxii-playlists/admin';

export default defineConfig({
  plugins: [nxViteTsPaths()],
  build: {
    lib: {
      entry: 'src/cxii-playlist.js',
      name: 'CxiiPlaylist',
      formats: ['iife'],
      fileName: () => 'cxii-playlist.js',
    },
    outDir: PATH_TO_PLAYLIST_PLUGIN,
    emptyOutDir: false
  }
});