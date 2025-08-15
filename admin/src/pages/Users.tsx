import { useEffect, useState } from 'react';
import axios from 'axios';

// Placeholder for user type
interface User {
  ID: number;
  username: string;
  role: 'user' | 'admin';
  password?: string; // Only for creating/updating
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModalForCreate = () => {
    setIsEditing(false);
    setCurrentUser({ username: '', role: 'user', password: '' });
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (user: User) => {
    setIsEditing(true);
    setCurrentUser({ ...user, password: '' }); // Clear password field for editing
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser({});
  };

  const handleSaveUser = async () => {
    // Basic validation
    if (!currentUser.username) {
        alert("Username is required");
        return;
    }
    if (!isEditing && !currentUser.password) {
        alert("Password is required for new users");
        return;
    }

    try {
      if (isEditing) {
        await api.put(`/users/${currentUser.ID}`, currentUser);
      } else {
        await api.post('/users', currentUser);
      }
      // Refetch users
      const response = await api.get('/users');
      setUsers(response.data);
      handleCloseModal();
    } catch (err) {
      setError('Failed to save user.');
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if(window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(user => user.ID !== id));
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">User Management</h1>
        <button onClick={handleOpenModalForCreate} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">
          Create User
        </button>
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.ID} className="border-b">
                <td className="py-2">{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleOpenModalForEdit(user)} className="text-blue-600 hover:underline mr-4">Edit</button>
                  <button onClick={() => handleDeleteUser(user.ID)} className="text-red-600 hover:underline">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit User' : 'Create User'}</h2>
            <div className="space-y-4">
               <input type="text" placeholder="Username" value={currentUser.username} onChange={e => setCurrentUser({...currentUser, username: e.target.value})} className="w-full p-2 border rounded" />
               <input type="password" placeholder={isEditing ? "New Password (optional)" : "Password"} value={currentUser.password} onChange={e => setCurrentUser({...currentUser, password: e.target.value})} className="w-full p-2 border rounded" />
               <select value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value as 'user' | 'admin'})} className="w-full p-2 border rounded">
                 <option value="user">User</option>
                 <option value="admin">Admin</option>
               </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={handleSaveUser} className="px-4 py-2 bg-primary text-white rounded-md">{isEditing ? 'Save Changes' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
