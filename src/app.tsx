import React from 'react';
import { render, Box, useInput } from 'ink';
import { useShallow } from 'zustand/react/shallow';
import Header from './components/Header.js';
import TaskList from './components/TaskList.js';
import Controls from './components/Controls.js';
import StatusBar from './components/StatusBar.js';
import ScriptMode from './components/modes/ScriptMode.js';
import AddTaskMode from './components/modes/AddTaskMode.js';
import EditTaskMode from './components/modes/EditTaskMode.js';
import PriorityMode from './components/modes/PriorityMode.js';
import DateMode from './components/modes/DateMode.js';
import SortMode from './components/modes/SortMode.js';
import DeleteConfirmMode from './components/modes/DeleteConfirmMode.js';
import { 
  useAppStore, 
  useTaskStore, 
  useScriptStore,
  useScriptStoreInit
} from './lib/store/index.js';
import { SortType } from './lib/store/useTaskStore.js';

// Main App component
const App = () => {
  // Initialize Zustand stores
  useScriptStoreInit();
  
  // Task store selectors
  const { 
    tasks,
    selectedIndex: taskIndex,
    navigateUp: navigateTaskUp,
    navigateDown: navigateTaskDown,
    toggleTask,
    deleteTask,
    addTask,
    editTask,
    setTaskPriority,
    setTaskDueDate,
    sortByPriority,
    sortAlphabetically,
    sortByDueDate,
    sortByCreatedAt,
    sortTasks,
    moveTaskUp,
    moveTaskDown
  } = useTaskStore(
    useShallow(state => ({
      tasks: state.tasks,
      selectedIndex: state.selectedIndex,
      navigateUp: state.navigateUp,
      navigateDown: state.navigateDown,
      toggleTask: state.toggleTask,
      deleteTask: state.deleteTask,
      addTask: state.addTask,
      editTask: state.editTask,
      setTaskPriority: state.setTaskPriority,
      setTaskDueDate: state.setTaskDueDate,
      sortByPriority: state.sortByPriority,
      sortAlphabetically: state.sortAlphabetically,
      sortByDueDate: state.sortByDueDate,
      sortByCreatedAt: state.sortByCreatedAt,
      sortTasks: state.sortTasks,
      moveTaskUp: state.moveTaskUp,
      moveTaskDown: state.moveTaskDown
    }))
  );

  // Script store selectors
  const { 
    scripts,
    selectedIndex: scriptIndex,
    scriptOutput,
    isRunningScript,
    navigateUp: navigateScriptUp,
    navigateDown: navigateScriptDown,
    runSelectedScript,
    clearOutput
  } = useScriptStore(
    useShallow(state => ({
      scripts: state.scripts,
      selectedIndex: state.selectedIndex,
      scriptOutput: state.scriptOutput,
      isRunningScript: state.isRunningScript,
      navigateUp: state.navigateUp,
      navigateDown: state.navigateDown,
      runSelectedScript: state.runSelectedScript,
      clearOutput: state.clearOutput
    }))
  );

  // App store selectors
  const { 
    mode,
    setMode,
    inputValue,
    setInputValue,
    statusMessage,
    setStatus,
    sortOptionIndex,
    setSortOptionIndex,
    dndOriginalTaskId,
    setDndOriginalTaskId
  } = useAppStore(
    useShallow(state => ({
      mode: state.mode,
      inputValue: state.inputValue,
      statusMessage: state.statusMessage,
      setMode: state.setMode,
      setInputValue: state.setInputValue,
      setStatus: state.setStatus,
      sortOptionIndex: state.sortOptionIndex,
      setSortOptionIndex: state.setSortOptionIndex,
      dndOriginalTaskId: state.dndOriginalTaskId,
      setDndOriginalTaskId: state.setDndOriginalTaskId
    }))
  );

  // Array of sort options for the sort mode
  const sortOptions = [
    { key: 'p', type: 'priority' as SortType, label: 'Priority', description: 'Sort by task priority (high to low)' },
    { key: 'a', type: 'alphabetical' as SortType, label: 'Alphabetical', description: 'Sort tasks alphabetically (A to Z)' },
    { key: 'd', type: 'dueDate' as SortType, label: 'Due Date', description: 'Sort by due date (earliest first)' },
    { key: 'c', type: 'createdAt' as SortType, label: 'Created Date', description: 'Sort by creation date (newest first)' }
  ];

  // Handle keyboard input
  useInput((input, key) => {
    if (mode === 'list') {
      if (key.downArrow) {
        navigateTaskDown();
      }
      
      if (key.upArrow) {
        navigateTaskUp();
      }
      
      if (input === 'a') {
        setMode('add');
        setStatus('Adding a new task...');
      }
      
      if ((input === 'e' || key.return) && tasks.length > 0) {
        setMode('edit');
        setInputValue(tasks[taskIndex].text);
        setStatus('Editing task...');
      }
      
      if (input === 'x' && tasks.length > 0) {
        setMode('deleteConfirm');
        setStatus('Confirm deletion');
      }
      
      if (input === ' ' && tasks.length > 0) {
        const isCompleted = toggleTask();
        setStatus(isCompleted ? 'Task completed!' : 'Task marked as incomplete');
      }
      
      // Direct priority setting in list mode
      if (input === '1' && tasks.length > 0) {
        setTaskPriority('low');
        setStatus('Priority set to low');
      } else if (input === '2' && tasks.length > 0) {
        setTaskPriority('medium');
        setStatus('Priority set to medium');
      } else if (input === '3' && tasks.length > 0) {
        setTaskPriority('high');
        setStatus('Priority set to high');
      }
      
      if (input === 'p' && tasks.length > 0) {
        setMode('priority');
      }
      
      if (input === 'd' && tasks.length > 0) {
        setMode('date');
      }
      
      if (input === 's') {
        setMode('scripts');
        setStatus('Script mode: Select a script to run');
      }
      
      if (input === 'o' && tasks.length > 1) {
        setMode('sort');
        setSortOptionIndex(0);
        setStatus('Sort mode: Use arrow keys to select sort type');
      }
      
      if (key.tab && tasks.length > 0) {
        setDndOriginalTaskId(tasks[taskIndex]?.id);
        setMode('dnd');
        setStatus('DnD mode: Use arrow keys to move task, Enter/Tab to apply, Esc to cancel');
      }
      
      if (key.escape) {
        process.exit(0);
      }
    } else if (mode === 'dnd') {
      if (key.upArrow) {
        const moved = moveTaskUp();
        if (moved) {
          setStatus('Task moved up');
        }
      }
      
      if (key.downArrow) {
        const moved = moveTaskDown();
        if (moved) {
          setStatus('Task moved down');
        }
      }
      
      if (key.return || key.tab) {
        setMode('list');
        setDndOriginalTaskId(undefined);
        setStatus('Task reordering applied');
      }
      
      if (key.escape) {
        // Reload tasks to undo changes
        useTaskStore.persist.rehydrate();
        
        // After rehydration, find the original task by ID and set that as the selected index
        // We need to do this in the next tick to allow rehydration to complete
        setTimeout(() => {
          const rehydratedTasks = useTaskStore.getState().tasks;
          if (dndOriginalTaskId) {
            const originalTaskIndex = rehydratedTasks.findIndex(task => task.id === dndOriginalTaskId);
            if (originalTaskIndex !== -1) {
              useTaskStore.setState({ selectedIndex: originalTaskIndex });
            }
          }
        }, 0);
        
        setMode('list');
        setDndOriginalTaskId(undefined);
        setStatus('Task reordering cancelled');
      }
    } else if (mode === 'deleteConfirm') {
      if (input === 'y' || input === 'Y') {
        deleteTask();
        setMode('list');
        setStatus('Task deleted');
      } else if (input === 'n' || input === 'N' || key.escape) {
        setMode('list');
        setStatus('Deletion cancelled');
      }
    } else if (mode === 'add') {
      if (key.escape) {
        setMode('list');
        setInputValue('');
        setStatus('Add task canceled');
      }
    } else if (mode === 'edit') {
      if (key.escape) {
        setMode('list');
        setInputValue('');
        setStatus('Edit canceled');
      }
    } else if (mode === 'priority') {
      if (input === '1' || input === 'l') {
        setTaskPriority('low');
        setMode('list');
        setStatus('Priority set to low');
      } else if (input === '2' || input === 'm') {
        setTaskPriority('medium');
        setMode('list');
        setStatus('Priority set to medium');
      } else if (input === '3' || input === 'h') {
        setTaskPriority('high');
        setMode('list');
        setStatus('Priority set to high');
      } else if (key.escape) {
        setMode('list');
      }
    } else if (mode === 'date') {
      if (key.escape) {
        setMode('list');
      }
    } else if (mode === 'scripts') {
      if (key.downArrow) {
        navigateScriptDown();
      }
      
      if (key.upArrow) {
        navigateScriptUp();
      }
      
      if (input === 'b' || input === 'B' || key.escape) {
        setMode('list');
        clearOutput();
      }
      
      if (key.return && scripts.length > 0) {
        runSelectedScript(setStatus);
      }
    } else if (mode === 'sort') {
      if (key.downArrow) {
        setSortOptionIndex(Math.min(sortOptionIndex + 1, sortOptions.length - 1));
      }
      
      if (key.upArrow) {
        setSortOptionIndex(Math.max(sortOptionIndex - 1, 0));
      }
      
      // Handle selection via Enter key
      if (key.return && tasks.length > 1) {
        const selectedOption = sortOptions[sortOptionIndex];
        sortTasks(selectedOption.type);
        setMode('list');
        setStatus(`Tasks sorted by ${selectedOption.label.toLowerCase()}`);
      }
      
      // Keep existing direct key selection
      if (input === 'p' && tasks.length > 1) {
        sortByPriority();
        setMode('list');
        setStatus('Tasks sorted by priority (high to low)');
      } else if (input === 'a' && tasks.length > 1) {
        sortAlphabetically();
        setMode('list');
        setStatus('Tasks sorted alphabetically (A to Z)');
      } else if (input === 'd' && tasks.length > 1) {
        sortByDueDate();
        setMode('list');
        setStatus('Tasks sorted by due date (earliest first)');
      } else if (input === 'c' && tasks.length > 1) {
        sortByCreatedAt();
        setMode('list');
        setStatus('Tasks sorted by creation date (newest first)');
      } else if (key.escape) {
        setMode('list');
      }
    }
  });

  // Handle task submission
  const handleSubmit = (value: string) => {
    addTask(value);
    setStatus('New task added!');
    setInputValue('');
    setMode('list');
  };

  // Handle edit submission
  const handleEditSubmit = (value: string) => {
    if (value.trim() === '') {
      setStatus('Task cannot be empty. Edit canceled.');
    } else {
      editTask(value);
      setStatus('Task updated!');
    }
    setInputValue('');
    setMode('list');
  };

  // Handle date submission
  const handleDateSubmit = (value: string) => {
    setTaskDueDate(value);
    setStatus('Due date set');
    setInputValue('');
    setMode('list');
  };

  // Render the appropriate mode component based on current mode
  const renderModeComponent = () => {
    switch (mode) {
      case 'add':
        return (
          <AddTaskMode
            inputValue={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
          />
        );
      case 'edit':
        return (
          <EditTaskMode
            taskText={tasks[taskIndex]?.text || ''}
            inputValue={inputValue}
            onChange={setInputValue}
            onSubmit={handleEditSubmit}
          />
        );
      case 'priority':
        return <PriorityMode />;
      case 'date':
        return (
          <DateMode
            inputValue={inputValue}
            onChange={setInputValue}
            onSubmit={handleDateSubmit}
          />
        );
      case 'scripts':
        return (
          <ScriptMode
            scripts={scripts}
            selectedIndex={scriptIndex}
            scriptOutput={scriptOutput}
            isRunningScript={isRunningScript}
          />
        );
      case 'sort':
        return <SortMode selectedIndex={sortOptionIndex} />;
      case 'deleteConfirm':
        return <DeleteConfirmMode task={tasks[taskIndex]} />;
      case 'dnd':
        return <TaskList tasks={tasks} selectedIndex={taskIndex} isDndMode={true} />;
      default:
        return <TaskList tasks={tasks} selectedIndex={taskIndex} />;
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      {renderModeComponent()}
      <Box flexDirection="column" marginTop={1}>
        <StatusBar tasks={tasks} mode={mode} statusMessage={statusMessage} />
        <Box marginTop={1}>
          <Controls />
        </Box>
      </Box>
    </Box>
  );
};

// Render the app
render(<App />);