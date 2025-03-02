# Ink-CLI Task Manager

A beautiful and feature-rich task management application that runs directly in your terminal. Built with React Ink for a smooth, interactive terminal UI experience.

## Features

✅ **Interactive Task Management**
- Create, edit, delete, and toggle task completion states
- Navigate through tasks with keyboard shortcuts
- Priority levels (low, medium, high) with color coding
- Due date management

🔄 **Task Organization**
- Sort tasks by priority, alphabetically, due date, or creation date
- Visual indicators for task status and priorities

⚙️ **Script Execution**
- Run custom scripts directly from the task manager
- View script outputs without leaving the application

🎨 **Beautiful Terminal UI**
- Modern, colorful interface with smooth interactions
- Responsive design that works in different terminal sizes
- Clear visual indicators and status messages

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start
```

## Usage

### Keyboard Controls

| Key           | Function                      |
|---------------|-------------------------------|
| ↑/↓           | Navigate through tasks        |
| Space         | Toggle task completion        |
| p             | Enter priority mode           |
| 1,2,3         | Set priority directly         |
| d             | Set due date                  |
| a             | Add a new task                |
| Enter/e       | Edit the selected task        |
| s             | Access script mode            |
| o             | Sort tasks                    |
| x             | Delete task                   |
| Esc           | Exit current mode/application |

### Task Priorities

- **Low (1)**: For tasks that are not urgent
- **Medium (2)**: For tasks that have moderate importance
- **High (3)**: For critical or urgent tasks

### Modes

The application has several specialized modes:
- **List Mode**: The default view showing all tasks
- **Add Task Mode**: For creating new tasks
- **Edit Task Mode**: For modifying existing tasks
- **Priority Mode**: For changing task priorities
- **Date Mode**: For setting due dates
- **Script Mode**: For running custom scripts
- **Sort Mode**: For sorting tasks by different criteria
- **Delete Confirmation Mode**: Confirms before deleting a task

## Technologies

- [React](https://reactjs.org/): For building the user interface
- [Ink](https://github.com/vadimdemedes/ink): React for command-line apps
- [TypeScript](https://www.typescriptlang.org/): For type safety
- [Zustand](https://github.com/pmndrs/zustand): For state management

## Development

```bash
# Run in development mode (build and start)
npm run dev
```

## License

MIT

## Acknowledgements

- [Ink](https://github.com/vadimdemedes/ink) - React for CLIs
- All the open-source libraries used in this project 