import { sveltekit } from '@sveltejs/kit/vite';
//import nodePolyfills from 'rollup-plugin-polyfill-node';

/**
 * I searched a million answers in the internet and borrowed pieces from everywhere, cant help finding all the sources anymore
 * Modules used: nodePolyfills, crypto-browserify, path-browserify
 */
 import { fileURLToPath } from 'url';
 import { dirname } from 'path';
 
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = JSON.stringify(dirname(__filename));
 
const defineConfig ={
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['three', 'troika-three-text']
	},
   optimizeDeps: {
	 esbuildOptions: {
	   define: {
		 global: 'globalThis',
		 __dirname : __dirname
	   }}},
	resolve: {
	  alias: {
	 path: "path-browserify",
	   crypto: "crypto-browserify"
	  }
	},
	build: {
	  target: "es2020",
	  rollupOptions: {
		//plugins: [nodePolyfills({ crypto: true })],
	  },
	}
  };

  export default defineConfig;
