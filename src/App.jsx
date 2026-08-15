import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./admin/adminLogin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

const MIN_DESKTOP_WIDTH = 768; // px

// Combines a User-Agent check (catches phones/tablets by device type) with
// a viewport-width check (catches any window too narrow to use the
// dashboard, even on a desktop browser resized small). Neither check is
// unbeatable from the client side, but together they block casual mobile
// access, which is the actual goal here.
const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export default function App() {
  const { t, i18n } = useTranslation();
  const [isBlocked, setIsBlocked] = useState(
    isMobileDevice() || window.innerWidth < MIN_DESKTOP_WIDTH
  );

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const handleResize = () => {
      setIsBlocked(isMobileDevice() || window.innerWidth < MIN_DESKTOP_WIDTH);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("adminLang", newLang);
  };

  if (isBlocked) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#052443] text-white text-center px-6 relative">
        <button
          onClick={toggleLanguage}
          className="absolute top-4 left-4 text-sm text-[var(--cyan)] font-semibold px-3 py-1.5 rounded-lg border border-[var(--cyan)] hover:bg-cyan-900/40 transition"
        >
          {i18n.language === "en" ? "العربية" : "English"}
        </button>
        <div>
          <h1 className="text-2xl font-bold mb-3">{t("desktopOnly.title")}</h1>
          <p className="text-gray-300">{t("desktopOnly.message")}</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}