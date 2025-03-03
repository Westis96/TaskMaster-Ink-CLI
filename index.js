#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// This is the entry point for the 'task' CLI command
if (process.env.NODE_ENV !== 'test') {
  try {
    await import('./dist/app.js');
  } catch (error) {
    console.error('Error launching TaskMaster:', error);
    process.exit(1);
  }
}