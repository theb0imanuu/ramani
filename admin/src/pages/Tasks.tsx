import { useEffect, useState } from 'react';
import axios from 'axios';

// Placeholder types
interface User {
  ID: number;
  username: string;
}
interface Task {
  ID: number;
  title: string;
  description: string;
  status: string;
  assignedTo?: User;
  incidentId: number;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({});

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, usersRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/users'),
        ]);
        setTasks(tasksRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModalForCreate = () => {
    setIsEditing(false);
    setCurrentTask({ title: '', description: '', status: 'pending', incidentId: 0 });
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (task: Task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask({});
  };

  const handleSaveTask = async () => {
    try {
      if (isEditing) {
        await api.put(`/tasks/${currentTask.ID}`, currentTask);
      } else {
        await api.post('/tasks', currentTask);
      }
      // Refetch tasks
      const response = await api.get('/tasks');
      setTasks(response.data);
      handleCloseModal();
    } catch (err) {
      setError('Failed to save task.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if(window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(task => task.ID !== id));
      } catch (err) {
        setError('Failed to delete task.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Task Management</h1>
        <button onClick={handleOpenModalForCreate} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">
          Create Task
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.ID} className="border-b">
                <td className="py-2">{task.title}</td>
                <td>{task.assignedTo?.username || 'Unassigned'}</td>
                <td><span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{task.status}</span></td>
                <td>
                  <button onClick={() => handleOpenModalForEdit(task)} className="text-blue-600 hover:underline mr-4">Edit</button>
                  <button onClick={() => handleDeleteTask(task.ID)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Task' : 'Create Task'}</h2>
            {/* Form fields would go here, this is a simplified version */}
            <div className="space-y-4">
               <input type="text" placeholder="Title" value={currentTask.title} onChange={e => setCurrentTask({...currentTask, title: e.target.value})} className="w-full p-2 border rounded" />
               <textarea placeholder="Description" value={currentTask.description} onChange={e => setCurrentTask({...currentTask, description: e.target.value})} className="w-full p-2 border rounded"></textarea>
               <input type="number" placeholder="Incident ID" value={currentTask.incidentId} onChange={e => setCurrentTask({...currentTask, incidentId: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
               <select value={currentTask.status} onChange={e => setCurrentTask({...currentTask, status: e.target.value})} className="w-full p-2 border rounded">
                 <option value="pending">Pending</option>
                 <option value="in_progress">In Progress</option>
                 <option value="completed">Completed</option>
               </select>
               <select value={currentTask.assignedTo?.ID} onChange={e => setCurrentTask({...currentTask, assignedToId: parseInt(e.target.value)})} className="w-full p-2 border rounded">
                 <option value="">Unassigned</option>
                 {users.map(user => <option key={user.ID} value={user.ID}>{user.username}</option>)}
               </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={handleSaveTask} className="px-4 py-2 bg-primary text-white rounded-md">{isEditing ? 'Save Changes' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
