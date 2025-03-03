import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface Script {
  id: string;
  name: string;
  path: string;
  description?: string;
}

export function useScriptManager() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scriptOutput, setScriptOutput] = useState('');
  const [isRunningScript, setIsRunningScript] = useState(false);

  // Navigate up
  const navigateUp = () => {
    setSelectedIndex(prev => Math.max(prev - 1, 0));
  };

  // Navigate down
  const navigateDown = () => {
    setSelectedIndex(prev => Math.min(prev + 1, scripts.length - 1));
  };

  // Clear script output
  const clearOutput = () => {
    setScriptOutput('');
  };

  // Run the selected script
  const runSelectedScript = (onStatusChange: (message: string) => void) => {
    if (scripts.length === 0) return;
    
    const selectedScript = scripts[selectedIndex];
    onStatusChange(`Running script: ${selectedScript.name}...`);
    setIsRunningScript(true);
    
    // Use Node.js child_process to run the Python script
    import('child_process').then(({ exec }) => {
      exec(`python "${selectedScript.path}"`, (error, stdout, stderr) => {
        setIsRunningScript(false);
        
        if (error) {
          onStatusChange(`Error running script: ${error.message}`);
          setScriptOutput(stderr);
        } else {
          onStatusChange(`Script ${selectedScript.name} completed successfully!`);
          setScriptOutput(stdout);
        }
        
        // Clear status message after 3 seconds
        setTimeout(() => onStatusChange(''), 3000);
      });
    });
  };

  // Discover Python scripts in the current directory
  useEffect(() => {
    import('fs').then(fs => {
      import('path').then(path => {
        // Read only the scripts directory for Python files
        const scriptsDir = path.join(process.cwd(), 'scripts');
        
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
        
        // Find scripts and update the state
        const pythonScripts = findPythonFiles(scriptsDir);
        setScripts(pythonScripts);
      });
    });
  }, []);

  return {
    scripts,
    selectedIndex,
    scriptOutput,
    isRunningScript,
    navigateUp,
    navigateDown,
    runSelectedScript,
    clearOutput
  };
} 