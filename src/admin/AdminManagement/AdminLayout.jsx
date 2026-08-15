import React from "react";

const AdminLayout = ({ children }) => {
  return (
      <main className="flex-1 ">
        <header className="h-16 bg-white shadow flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-700">User</h1>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Admin</span>
            <div className="w-9 h-9 rounded-full bg-[#39CCCC]" />
          </div>
        </header>

        <div className="px-8 pt-3 flex-1 p-6">{children}</div>
      </main>
  );
};

export default AdminLayout;
