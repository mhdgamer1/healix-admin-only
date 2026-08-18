import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faChartPie, faDatabase, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../utils/apiClient";

export default function AdminSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <aside className="w-16 md:w-56 min-h-screen bg-[#052443] text-white flex flex-col pt-5 flex-shrink-0">
      <NavLink to="/" className="logo w-[40px] md:w-[180px] mx-auto md:ms-3 md:mx-0">
        <img src="/Logo-light.png" alt="logo" />
      </NavLink>

      <nav className="flex-1 px-2 md:px-5 py-4 space-y-3">
        <SidebarLink to="/admin-dashboard/statistics" icon={faChartPie} iconColor="text-cyan-500" label={t("sidebar.statistics")} />
        <SidebarLink to="/admin-dashboard/completed-services" icon={faDatabase} iconColor="text-cyan-500" label={t("sidebar.services")} />
        <SidebarLink to="/admin-dashboard/management" icon={faUsers} iconColor="text-cyan-500" label={t("sidebar.management")} />

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center md:justify-start gap-0 md:gap-3 px-2 md:px-5 py-3 rounded-lg text-sm text-red-300 hover:text-red-400 transition w-full"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span className="hidden md:inline">{t("sidebar.signOut")}</span>
        </button>
      </nav>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[340px] text-center">
            <h2 className="text-lg font-semibold text-[#052443] mb-2">
              {t("sidebar.logoutConfirmTitle")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t("sidebar.logoutConfirmMessage")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {loggingOut ? t("common.loading") : t("sidebar.signOut")}
              </button>
            </div>
          </div>
        </div>
      )}
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