import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points
  entry: {
    index: 'src/index.ts',
  },
  
  // Output formats
  format: ['cjs', 'esm'],  // CommonJS and ES Modules
  
  // Output directory
  outDir: 'dist',
  
  // TypeScript declarations
  dts: true,
  
  // Source maps for debugging
  sourcemap: true,
  
  // Clean output directory before build
  clean: true,
  
  // Code splitting for better tree shaking
  splitting: false,
  
  // Minification for production builds
  minify: true,
  
  // Target environment
  target: 'es2020',
  
  // Platform
  platform: 'node',
  
  // Keep names for better debugging
  keepNames: true,
  

  // Bundle configuration
  bundle: true,
  
  // Tree shaking
  treeshake: true,
  
  // Skip node_modules type checking for faster builds
  skipNodeModulesBundle: true,
  
  // esbuild options
  esbuildOptions(options) {
    options.charset = 'utf8';
    options.legalComments = 'none';
  },
  
  // Define environment variables at build time
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  
  // Async plugins support
  async onSuccess() {
    console.log('✅ Build completed successfully!');
  },
});

