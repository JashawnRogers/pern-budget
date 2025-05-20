import { useState } from "react";
import logo from "../../assets/logo-transparent.svg";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import LogoutButton from "../utils/LogoutButton";
import { useAuth } from "../../api/auth/authContext";

const DashboardNav = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="w-full px-4 py-4 flex justify-between items-center relative flex-wrap">
        <NavLink to="/dashboard" className="flex items-center gap-2 sm:gap-3">
          <img
            src={logo}
            className="w-64 md:w-52 object-contain align-middle"
            alt="SpendWise logo"
          />
          <h1 className="-ml-24 md:-ml-16 montesserat-400 text-3xl sm:text-3xl md:text-3xl leading-tight">
            SpendWise
          </h1>
        </NavLink>

        <ul className="hidden lg:flex items-center gap-4 text-base xl:text-xl montesserat-300">
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/budget">Budgets</NavLink>
          </li>
          <li>
            <NavLink to="/transactions">Transactions</NavLink>
          </li>
          <li>
            <NavLink to="/savings">Savings Goals</NavLink>
          </li>
        </ul>

        <ul className="hidden lg:flex items-center gap-4 montesserat-300 text-sm xl:text-base">
          <li>
            <NavLink to="/settings">
              <CiSettings className="w-6 h-6" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings">
              {user.profile_image ? (
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={user.profile_image}
                  alt="User profile"
                />
              ) : (
                <CgProfile className="w-10 h-10" />
              )}
            </NavLink>
          </li>
          <li className="flex flex-col">
            <p className="font-bold">
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </p>
            <p className="text-xs truncate max-w-[150px]">{user.email}</p>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>

        <div className="lg:hidden z-50">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-6 text-base montesserat-300 lg:hidden">
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/budget" onClick={() => setIsOpen(false)}>
              Budgets
            </NavLink>
            <NavLink to="/transactions" onClick={() => setIsOpen(false)}>
              Transactions
            </NavLink>
            <NavLink to="/savings" onClick={() => setIsOpen(false)}>
              Savings Goals
            </NavLink>
            <NavLink to="/settings" onClick={() => setIsOpen(false)}>
              Settings
            </NavLink>
            <LogoutButton />
          </div>
        )}
      </nav>
    </header>
  );
};

export default DashboardNav;
