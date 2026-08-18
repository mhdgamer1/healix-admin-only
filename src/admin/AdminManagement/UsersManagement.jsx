import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {apiFetch} from "../../utils/apiClient"
const UsersManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [attachments, setAttachments] = useState([]);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch(
        `/api/admin/users?page=${page}`,
  
      );
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      const formatted = result.data.map((item) => ({
        id: item.id,
        fullName: item.full_name,
        email: item.email,
        userType: item.user_type,
        status: item.status,
        attachment: item.attachment,
        createdAt: item.created_at,
      }));
      if (result.status === "success") {
        setUsers(formatted);
        setLastPage(result.meta.last_page);
      }
    } catch (err) {
      console.error("Failed Fetching Users", err);
      setError(t("usersManagement.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const ViewAttachments = async (user_id) => {
    try {
      const response = await apiFetch(
        `/api/admin/users/${user_id}/attachments`);
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      if (result.status === "success") {
        setAttachments(result.data);
        setIsAttachmentsOpen(true);
      }
    } catch (err) {
      console.error("Failed fetching attachments", err);
    }
  };

  const Approve = async (id) => {
    try {
      const response = await apiFetch(
        `/api/admin/users/${id}/approve`,
        {
          method: "PATCH",
       
        }
      );
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      if (result.status === "success") {
        alert(t("usersManagement.activateSuccess"));
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { ...user, status: "approved" } : user))
        );
      }
    } catch (err) {
      console.error("Failed Approving Account", err);
    }
  };

  const Reject = async (id) => {
    try {
      const response = await apiFetch(
        `/api/admin/users/${id}/reject`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      if (result.status === "success") {
        alert(t("usersManagement.rejectSuccess"));
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
    } catch (err) {
      console.error("Failed Rejecting Account", err);
    }
  };

  const openEditModal = (user) => {
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditUserId(user.id);
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    try {
      const response = await apiFetch(
        `/api/admin/users/${editUserId}/edit`,
        {
          method: "PUT",
          body: JSON.stringify({ full_name: editFullName, email: editEmail }),
        }
      );
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      if (result.status === "success") {
        alert(t("usersManagement.updateSuccess"));
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editUserId ? { ...user, fullName: editFullName, email: editEmail } : user
          )
        );
        setEditEmail("");
        setEditFullName("");
        setIsEditOpen(false);
      }
    } catch (err) {
      console.error("Failed Editing Account", err);
    }
  };

  const Delete = async (id) => {
    try {
      const response = await apiFetch(
        `/api/admin/users/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      if (result.status === "success") {
        alert(t("usersManagement.deleteSuccess"));
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
    } catch (err) {
      console.error("Failed Deleting Account", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    setIsAttachmentsOpen(false);
  }, [page]);

  return (
    <>
      <h1 className="text-2xl font-bold text-[#052443] mb-6">{t("usersManagement.title")}</h1>
      <div className="bg-white rounded-xl shadow">
        {isLoading && <p className="text-center text-gray-500 mb-6">{t("common.loading")}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <table className="w-full text-sm text-left">
          <thead className="bg-[#eaf7f7] text-gray-700">
            <tr>
              <th className="p-4">{t("usersManagement.id")}</th>
              <th>{t("usersManagement.fullName")}</th>
              <th>{t("usersManagement.email")}</th>
              <th>{t("usersManagement.userType")}</th>
              <th>{t("usersManagement.attachments")}</th>
              <th>{t("usersManagement.date")}</th>
              <th>{t("usersManagement.action")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-4">#{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.userType}</td>
                <td>
                  {user.attachment ? (
                    <button
                      onClick={() => ViewAttachments(user.id)}
                      className="text-[#39CCCC] border border-[#39CCCC] px-3 py-1 rounded-lg"
                    >
                      {t("usersManagement.view")}
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2 py-3">
                  {user.status !== "approved" ? (
                    <>
                      <button
                        onClick={() => Approve(user.id)}
                        className="px-3 py-1 bg-[#39CCCC] text-white rounded-lg"
                      >
                        {t("usersManagement.activate")}
                      </button>
                      <button
                        onClick={() => Reject(user.id)}
                        className="px-3 py-1 border border-red-400 text-red-500 rounded-lg"
                      >
                        {t("usersManagement.decline")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 border border-gray-400 rounded-lg"
                      >
                        {t("usersManagement.edit")}
                      </button>
                      <button
                        onClick={() => Delete(user.id)}
                        className="px-3 py-1 border border-red-400 text-red-500 rounded-lg"
                      >
                        {t("usersManagement.delete")}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg disabled:text-gray-400"
          >
            {t("common.previous")}
          </button>
          <span className="text-sm">
            {t("common.page")} {page} {t("common.of")} {lastPage}
          </span>
          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:text-gray-400"
          >
            {t("common.next")}
          </button>
        </div>
      </div>

      {isAttachmentsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">{t("usersManagement.userAttachments")}</h2>
            {attachments.length === 0 ? (
              <p className="text-gray-500 text-sm">{t("usersManagement.noAttachments")}</p>
            ) : (
              <ul className="space-y-2">
                {attachments.map((file) => (
                  <li key={file.id} className="flex justify-between items-center">
                    <span className="text-sm">
                      {t("usersManagement.category")}: {file.category}
                    </span>
                    <span className="text-sm">
                      {t("usersManagement.fileName")}: {file.file_name}
                    </span>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-500 text-sm"
                    >
                      {t("usersManagement.view")}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setIsAttachmentsOpen(false)}
              className="mt-4 w-full border border-gray-300 rounded-lg py-1"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">{t("usersManagement.editUser")}</h2>
            <label className="block mb-2 text-sm">{t("usersManagement.fullName")}:</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 mb-4"
              value={editFullName || ""}
              onChange={(e) => setEditFullName(e.target.value)}
            />
            <label className="block mb-2 text-sm">{t("usersManagement.email")}:</label>
            <input
              type="email"
              className="w-full border rounded px-2 py-1 mb-4"
              value={editEmail || ""}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <button onClick={submitEdit} className="px-4 py-2 bg-[#39CCCC] text-white rounded-lg mr-2">
              {t("common.save")}
            </button>
            <button
              onClick={() => {
                setEditEmail("");
                setEditFullName("");
                setIsEditOpen(false);
              }}
              className="px-4 py-2 border border-gray-400 rounded-lg"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersManagement;