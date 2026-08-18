import React from "react";
import { useTranslation } from "react-i18next";

const AdminLayout = ({ children }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("adminLang", newLang);
  };

  return (
    <main className="flex-1">
      <header className="h-16 bg-white shadow flex items-center justify-between px-8">
        <h1 className="text-xl font-semibold text-gray-700">{t("adminLayout.userTitle")}</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-sm text-[var(--cyan)] font-semibold px-3 py-1.5 rounded-lg border border-[var(--cyan)] hover:bg-cyan-50 transition"
          >
            {i18n.language === "en" ? "العربية" : "English"}
          </button>
          <span className="font-medium text-gray-700">{t("adminLayout.admin")}</span>
          <div className="w-9 h-9 rounded-full bg-[#39CCCC]" />
        </div>
      </header>

      <div className="px-8 pt-3 flex-1 p-6">{children}</div>
    </main>
  );
};

export default AdminLayout;