import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Define types for tasks
interface Task {
    id: string;
    files: string[];
}

interface TaskRoutesProps {
    tasks: Task[];
}

interface TaskListProps {
    tasks: Task[];
}

// Dynamically import all task components
const taskFiles = import.meta.glob('./tasks/**/[0-9]{1,}@(a|b|ideal).jsx');

function TaskRoutes({ tasks }: TaskRoutesProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {tasks.map((task) =>
                    task.files.map((file) => (
                        <Route
                            key={`${task.id}-${file}`}
                            path={`/task/${task.id}/${file}`}
                            element={
                                React.createElement(
                                    React.lazy(() =>
                                        taskFiles[`./tasks/${task.id}/${file}.jsx`]().then((module: any) => ({
                                            default: module.default,
                                        }))
                                    )
                                )
                            }
                        />
                    ))
                )}
            </Routes>
        </Suspense>
    );
}

function TaskList({ tasks }: TaskListProps) {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Tasks List</h1>
            <ul className="space-y-4">
                {tasks.map((task) => (
                    <li key={task.id}>
                        <h3 className="text-2xl font-semibold">Task {task.id}</h3>
                        <ul className="list-disc pl-4">
                            {task.files.map((file) => (
                                <li key={file}>
                                    <Link to={`/task/${task.id}/${file}`} className="text-blue-600 hover:underline">
                                        {file}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Layout() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const location = useLocation();

    useEffect(() => {
        const taskData: Task[] = [];

        // Populate tasks array with task paths
        Object.keys(taskFiles).forEach((filePath) => {
            const pathParts = filePath.split('/');
            const taskId = pathParts[2];
            const taskFile = pathParts[3].replace('.jsx', '');

            if (!taskData.some((task) => task.id === taskId)) {
                taskData.push({ id: taskId, files: [] });
            }

            taskData.find((task) => task.id === taskId)?.files.push(taskFile);
        });

        setTasks(taskData);
    }, []);

    // Check if we are in a task route
    const isTaskRoute = location.pathname.startsWith('/task/');

    return isTaskRoute ? (
        // Render only the task component
        <TaskRoutes tasks={tasks} />
    ) : (
        // Render the task list and normal layout when not on a task route
        <TaskList tasks={tasks} />
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;