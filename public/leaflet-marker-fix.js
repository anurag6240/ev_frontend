// This script ensures Leaflet marker icons are available in the public directory
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const leafletPath = resolve(__dirname, '../node_modules/leaflet/dist/images');
  const publicPath = resolve(__dirname, 'leaflet-images');

  // Create the directory if it doesn't exist
  if (!existsSync(publicPath)) {
    mkdirSync(publicPath, { recursive: true });
  }

  // Copy marker icon files
  const files = ['marker-icon.png', 'marker-shadow.png'];
  files.forEach(file => {
    const sourcePath = join(leafletPath, file);
    const targetPath = join(publicPath, file);
    
    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, targetPath);
      console.log(`Copied ${file} to public directory`);
    } else {
      console.warn(`Warning: ${file} not found in ${leafletPath}`);
    }
  });
} catch (error) {
  console.error('Error copying Leaflet marker files:', error);
  process.exit(1);
} 
