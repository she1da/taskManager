import { useState, useEffect } from "react";
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

const AddTask = () => {
    const [taskName, setTaskName] = useState("");
    const [tasksList, setTasksList] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [editedItem, setEditedItem] = useState("");

    const [isEdit, setIsEdit] = useState("");

    const router = useRouter();
    const getLocalStorageValue = (ItemName) => {
        if (typeof window !== "undefined") {
            const storedTasks = localStorage.getItem(ItemName);

            if (!storedTasks) {
                setTasksList([]);
                return;
            }

            try {
                return JSON.parse(storedTasks);
            } catch (error) {
                console.error("Error parsing tasks from localStorage:", error);
                setTasksList([]);
            }
        }
    };
    useEffect(() => {
        const parsedTaskList = getLocalStorageValue("tasks");
        if (Array.isArray(parsedTaskList)) {
            setTasksList(parsedTaskList);
        } else {
            setTasksList([]);
        }
    }, []);
    useEffect(() => {
        if (isSubmitted) {
            localStorage.setItem("tasks", JSON.stringify(tasksList));
            localStorage.setItem("editedItem", null);

            router.push("/");
        }
    }, [tasksList]);
    useEffect(() => {
        const taskToEdit = getLocalStorageValue("editedItem");
        console.log({ taskToEdit });
        if (taskToEdit) {
            setIsEdit(true);
            setEditedItem(taskToEdit);
            setTaskName(taskToEdit.taskName);
        }
    }, []);

    const handleSaveEdit = (e) => {
        e.preventDefault();

        const updatedTasks = tasksList.map((task) =>
            task.id === editedItem.id ? { ...task, taskName } : task
        );

        setTasksList(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTaskName("");
        setIsSubmitted(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim() !== "") {
            setTasksList((prevTasks) => [
                ...prevTasks,
                { taskName, id: generateRandomId() },
            ]);
            setIsSubmitted(true);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Task</h1>
            <form className="flex flex-col">
                <label htmlFor="taskName" className="mb-2">
                    Task Name
                </label>
                <input
                    id="taskName"
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="border p-2 mb-4 text-blue-600"
                    autoComplete="off"
                    required
                />
                {isEdit ? (
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleSaveEdit}
                    >
                        save
                    </button>
                ) : (
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        Add Task
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddTask;
