import { NavLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { FaBell } from 'react-icons/fa';
import { MdWork } from "react-icons/md";

import logo from '../../../assets/logo.png';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-sky-900 text-white flex-shrink-0">
      <div className="w-full flex flex-col justify-center items-center gap-4 mt-5">
        <img className='w-35' src={logo} alt="" />
        <h2 className="text-2xl text-white">Sistema portuário</h2>
      </div>
      <ul className="flex flex-col p-4 space-y-2 mt-5 pl-7">
        <li>
          <NavLink
            to="/"
            className="block px-4 py-2 rounded hover:bg-sky-950 transition-colors"
          >
            <div className="flex justify-start items-center gap-3.5">
              <FaHome size={24} color="#F1D821" />
              Dashboard
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className="block px-4 py-2 rounded hover:bg-sky-950 transition-colors"
          >
            <div className="flex justify-start items-center gap-3.5">
              <IoMdPerson size={24} color="#F1D821" />
              Operadores
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/positions"
            className="block px-4 py-2 rounded hover:bg-sky-950 transition-colors"
          >
            <div className="flex justify-start items-center gap-3.5">
              <MdWork size={24} color="#F1D821" />
              Cargos
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="#"
            className="block px-4 py-2 rounded hover:bg-sky-950 transition-colors"
          >
            <div className="flex justify-start items-center gap-3.5">
              <FaBell size={24} color="#F1D821" />
              Lorem ipsum
            </div>
          </NavLink>
        </li>
      </ul>
      <div className="flex justify-center items-center mt-10">
        <button className="bg-amber-300 text-sky-950 pl-5 pr-5 pt-1.5 pb-1.5 rounded-[5px] cursor-pointer hover:bg-amber-400 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
