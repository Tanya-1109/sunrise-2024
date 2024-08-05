import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { SiTicktick } from "react-icons/si";
import { MdDeleteForever } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

const inter = Inter({ subsets: ["latin"] });

type Task = {
  id: number;
  title: string;
  description: string;
  persona: string;
  group: number;
  completed: boolean;
};

export default function Home() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [persona, setPersona] = useState("");
  const [group, setGroup] = useState<number>(0);
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks("all");
    fetchTasks("active");
    fetchTasks("completed");
  }, []);

  const fetchTasks = async (type: string) => {
    const res = await fetch(`/api/hello?type=${type}`);
    const tasks = await res.json();
    if (type === "all") {
      setAllTasks(tasks);
    } else if (type === "active") {
      setActiveTasks(tasks);
    } else if (type === "completed") {
      setCompletedTasks(tasks);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, persona, group }),
    });
    if (res.ok) {
      const newTask = await res.json();
      setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== newTask.id));
      fetchTasks("all");
      setTitle("");
      setDescription("");
      setPersona("");
      setGroup(0);
      setOpenModal(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    const res = await fetch("/api/hello", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: taskId, completed: true }),
    });
    if (res.ok) {

      setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      fetchTasks("active");
      fetchTasks("completed");
    }
  };

  const handleUpdateTask = (task: Task) => {
    setUpdatingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPersona(task.persona);
    setGroup(task.group);
  };

  const handleSubmitUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingTask) {
      const res = await fetch("/api/hello", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatingTask.id,
          title,
          description,
          persona,
          group,
        }),
      });
      if (res.ok) {
        fetchTasks("all");
        fetchTasks("active");
        setUpdatingTask(null);
        setTitle("");
        setDescription("");
        setPersona("");
        setGroup(0);
        setOpenModal(false);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const res = await fetch(`/api/hello?id=${taskId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setActiveTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setCompletedTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  return (
    <div className={`min-h-screen relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-10 ${inter.className} `}>
      {openModal &&
        <div className="w-[85%] z-[100] shadow-md mx-auto absolute top-28 left-24 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8 backdrop-blur-sm">
          {updatingTask ? (
            <>
              <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Update Task</h2>
                <ImCross color="black" onClick={() => setOpenModal(false)} />
              </div>
              <form onSubmit={handleSubmitUpdateTask} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Persona"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Group"
                  value={group}
                  onChange={(e) => setGroup(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Update Task
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create Task</h2>
                <ImCross color="black" onClick={() => setOpenModal(false)} />
              </div>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Persona"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Group"
                  value={group}
                  onChange={(e) => setGroup(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Create Task
                </button>
              </form>
            </>
          )}
        </div>
      }
      <div className={`relative container mx-auto px-4 ${openModal ? "filter blur-md" : ""}`}>
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <h1 className="text-4xl font-bold text-center text-white shadow-text">Taskboard System</h1>
          <button
            className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setOpenModal(true)}
          >
            + Create Task
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* All Tasks Column */}
          <div className="bg-white bg-opacity-40 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4 text-white shadow-text">All Tasks</h2>
            <ul className="space-y-4">
              {allTasks.map((task) => (
                <li key={task.id} className="bg-white bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-700">{task.description}</p>
                  <p className="italic text-gray-600">{task.persona}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        handleUpdateTask(task);
                      }}
                      className="px-4 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors duration-300 shadow-md"
                    >
                      <FaPenToSquare size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition-colors duration-300 shadow-md"
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Tasks Column */}
          <div className="bg-white bg-opacity-40 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4 text-white shadow-text">Active Tasks</h2>
            <ul className="space-y-4">
              {activeTasks.map((task) => (
                <li key={task.id} className="bg-white bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-700">{task.description}</p>
                  <p className="italic text-gray-600">{task.persona}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="px-4 py-2 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors duration-300 shadow-md"
                    >
                      <SiTicktick size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Completed Tasks Column */}
          <div className="bg-white bg-opacity-40 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4 text-white shadow-text">Completed Tasks</h2>
            <ul className="space-y-4">
              {completedTasks.map((task) => (
                <li key={task.id} className="bg-white bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-700">{task.description}</p>
                  <p className="italic text-gray-600">{task.persona}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition-colors duration-300 shadow-md"
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}