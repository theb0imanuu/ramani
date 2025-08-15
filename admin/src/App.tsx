import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import MainLayout from './components/MainLayout'; // A new component to wrap the main pages

// A simple authentication check
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// A wrapper for private routes
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
