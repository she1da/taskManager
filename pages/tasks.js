import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function generateRandomId(length = 8) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }
    return id;
}

const Tasks = () => {
    const [tasksList, setTasksList] = useState([]);
    const [editedItem, setEditedItem] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTasks = localStorage.getItem("tasks");

            if (!storedTasks) {
                setTasksList([]);
                return;
            }

            try {
                const parsedTaskList = JSON.parse(storedTasks);
                if (Array.isArray(parsedTaskList)) {
                    setTasksList(parsedTaskList);
                } else {
                    setTasksList([]);
                }
            } catch (error) {
                console.error("Error parsing tasks from localStorage:", error);
                setTasksList([]);
            }
        }
    }, []);

    const handleDelete = (id) => {
        const updatedTasks = tasksList.filter((item) => item.id !== id);
        setTasksList(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    const handleEdit = (id) => {
        const taskToEdit = tasksList.find((task) => task.id === id);

        if (taskToEdit) {
            setEditedItem(taskToEdit);
        }
    };
    useEffect(() => {
        if (editedItem) {
            localStorage.setItem("editedItem", JSON.stringify(editedItem));
            router.push("/add-task");
        }
    }, [editedItem]);
    return (
        <div className="container mx-auto p-4">
            <div className="flex mb-4">
                <div className="w-14 flex-none"></div>
                <div className="w-64 flex-1">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                </div>
                <div className="w-32 ">
                    <Link
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        href="/add-task"
                    >
                        Add
                    </Link>
                </div>
            </div>

            <ul className="divide-y divide-gray-200 px-4">
                {tasksList.length > 0 ? (
                    tasksList.map((task) => (
                        <li key={task.id} className="py-4">
                            <p className="p-2">
                                <span>{task.taskName}</span>
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(task.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No tasks available</p>
                )}
            </ul>
        </div>
    );
};

export default Tasks;
