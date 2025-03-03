import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useScriptStore, Script } from './useScriptStore.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the absolute path to the repository root directory
const getRepoRoot = () => {
  // For ESM modules, we need to use this approach to get __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // Navigate up from src/lib/store to the repo root
  return join(__dirname, '..', '..', '..');
};

// Hook to initialize script store
export function useScriptStoreInit() {
  const setScripts = useScriptStore((state: { setScripts: (scripts: Script[]) => void }) => state.setScripts);
  
  // Initialize script store with Python scripts
  useEffect(() => {
    import('fs').then(fs => {
      import('path').then(path => {
        // Read only the scripts directory for Python files
        const scriptsDir = path.join(getRepoRoot(), 'scripts');
        
        // Ensure the scripts directory exists
        if (!fs.existsSync(scriptsDir)) {
          fs.mkdirSync(scriptsDir, { recursive: true });
        }
        
        const findPythonFiles = (dir: string): Script[] => {
          let results: Script[] = [];
          
          try {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
              const filePath = path.join(dir, file);
              const stat = fs.statSync(filePath);
              
              if (stat.isDirectory() && !file.startsWith('.')) {
                // Recursively search subdirectories
                results = results.concat(findPythonFiles(filePath));
              } else if (file.endsWith('.py')) {
                // Found a Python file
                results.push({
                  id: nanoid(),
                  name: file,
                  path: filePath,
                  description: `Python script: ${file}`
                });
              }
            }
          } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
          }
          
          return results;
        };
        
        // Find scripts and update the store
        setScripts(findPythonFiles(scriptsDir));
      });
    });
  }, [setScripts]);
} 