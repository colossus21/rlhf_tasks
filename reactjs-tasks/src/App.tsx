import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Task List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <Card key={task.id} className="shadow-md">
                        <CardHeader>
                            <h3 className="text-2xl font-semibold">Task {task.id}</h3>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-4 space-y-2">
                                {task.files.map((file) => (
                                    <li key={file}>
                                        <Link to={`/task/${task.id}/${file}`}>
                                            <Button variant="link">{file}</Button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
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

        // Force reload on first page load
        if (!sessionStorage.getItem('reloaded')) {
            sessionStorage.setItem('reloaded', 'true');
            window.location.reload();
        }
    }, []);

    // Check if we are in a task route
    const isTaskRoute = location.pathname.startsWith('/task/');

    return isTaskRoute ? (
        <TaskRoutes tasks={tasks} />
    ) : (
        <div className="container mx-auto">
            <Separator />
            <TaskList tasks={tasks} />
        </div>
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
