const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Ensure dist/lib directory exists for Pino dependencies
if (!fs.existsSync('dist/lib')) {
  fs.mkdirSync('dist/lib', { recursive: true });
}

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: 'dist/index.cjs',
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  external: [
    // Node.js built-in modules that should not be bundled
    'child_process',
    'crypto',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'stream',
    'url',
    'util',
    'dns',
    'tls',
    'zlib',
    'worker_threads'
  ],
  resolveExtensions: ['.ts', '.js', '.json'],
  packages: 'bundle',
  loader: {
    '.node': 'copy'
  },
  banner: {
    js: '#!/usr/bin/env node'
  },
  allowOverwrite: true
}).then(() => {
  // Copy Pino files after successful build
  const pinoLibFiles = [
    'symbols.js', 'caller.js', 'redaction.js', 'proto.js', 'meta.js',
    'deprecations.js', 'multistream.js', 'worker.js', 'time.js', 'levels.js',
    'constants.js', 'transport-stream.js', 'transport.js', 'tools.js'
  ];
  
  const filesToCopy = [
    { source: 'node_modules/pino/pino.js', dest: 'dist/pino.js' },
    ...pinoLibFiles.map(file => ({
      source: `node_modules/pino/lib/${file}`,
      dest: `dist/lib/${file}`
    }))
  ];
  
  filesToCopy.forEach(({ source, dest }) => {
    if (fs.existsSync(source)) {
      // Ensure destination directory exists
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(source, dest);
      console.log(`✓ Copied ${path.basename(source)} to ${dest}`);
    } else {
      console.warn(`⚠ File not found: ${source}`);
    }
  });
  
  console.log('Build completed successfully');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
