import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClass = "flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700";
  const activeLinkClass = "flex items-center px-4 py-2 text-white bg-gray-700";

  return (
    <div className="flex flex-col w-64 bg-primary text-white">
      <div className="flex items-center justify-center h-16 bg-primary-dark">
        <span className="text-white font-bold uppercase">Ramani Admin</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          Map View
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          Tasks
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          Users
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
