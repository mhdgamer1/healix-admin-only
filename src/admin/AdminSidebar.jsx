import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faChartPie,
  faDatabase,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

export default function AdminSidebar() {
  return (
    <aside className="w-16 md:w-56 min-h-screen bg-[#052443] text-white flex flex-col pt-5 flex-shrink-0">
      
      {/* Logo — hidden on small screens, only the collapsed icon rail shows */}
      <NavLink to="/" className="logo w-[40px] md:w-[180px] mx-auto md:ms-3 md:mx-0">
        <img src="../Logo-light.png" alt="logo" />
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 px-2 md:px-5 py-4 space-y-3">
        <SidebarLink
          to="/admin-dashboard/statistics"
          icon={faChartPie}
          iconColor="text-cyan-500"
          label="Statistics"
        />
        <SidebarLink
          to="/admin-dashboard/completed-services"
          icon={faDatabase}
          iconColor="text-cyan-500"
          label="Services"
        />
        <SidebarLink
          to="/admin-dashboard/management"
          icon={faUsers}
          iconColor="text-cyan-500"
          label="Management"
        />

        <button className="flex items-center justify-center md:justify-start gap-0 md:gap-3 px-2 md:px-5 py-3 rounded-lg text-sm text-red-300 hover:text-red-400 transition w-full">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}

function SidebarLink({ to, icon, label, iconColor }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-center md:justify-start gap-0 md:gap-3 px-2 md:px-4 py-3 rounded-lg text-sm font-medium transition
        ${isActive ? "bg-white text-[#052443]" : "hover:bg-[#0a355f]"}`
      }
    >
      <FontAwesomeIcon icon={icon} className={iconColor ? iconColor : "text-white"} />
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  );
}