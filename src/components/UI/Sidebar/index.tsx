import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-sky-900 text-white flex-shrink-0">
      <ul className="flex flex-col p-4 space-y-2">
        <li>
          <NavLink
            to="/"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Operadores
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Lorem ipsum
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
