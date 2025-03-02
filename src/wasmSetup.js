// This file helps locate WASM files correctly when bundled
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Export a function to resolve WASM paths
export function resolveWasmPath(wasmFile) {
  return join(__dirname, wasmFile);
} 