import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useScriptStore, Script } from './useScriptStore.js';

// Hook to initialize script store
export function useScriptStoreInit() {
  const setScripts = useScriptStore((state: { setScripts: (scripts: Script[]) => void }) => state.setScripts);
  
  // Initialize script store with Python scripts
  useEffect(() => {
    import('fs').then(fs => {
      import('path').then(path => {
        // Read the current directory recursively to find Python files
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
        
        try {
          const pythonScripts = findPythonFiles('.');
          setScripts(pythonScripts);
        } catch (error) {
          console.error('Error finding Python scripts:', error);
        }
      });
    });
  }, [setScripts]);
} 