#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// This is a workaround for ESM compatibility
if (process.env.NODE_ENV !== 'test') {
  await import('./dist/app.js');
}