import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Define paths to clean
const cacheDirs = [
  path.resolve('node_modules/.vite'),
  path.resolve('node_modules/.cache')
];

// Delete cache directories
console.log('Cleaning Vite cache directories...');
cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Removing ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Run npm commands
console.log('\nRemoving node_modules and package-lock.json...');
exec('rm -rf node_modules package-lock.json', (error) => {
  if (error) {
    console.error(`Error removing files: ${error}`);
    return;
  }
  
  console.log('\nRe-installing dependencies...');
  exec('npm install', (error) => {
    if (error) {
      console.error(`Error reinstalling dependencies: ${error}`);
      return;
    }
    
    console.log('\nStarting development server...');
    exec('npm run dev', (error, stdout) => {
      if (error) {
        console.error(`Error starting dev server: ${error}`);
        return;
      }
      console.log(stdout);
    });
  });
});
