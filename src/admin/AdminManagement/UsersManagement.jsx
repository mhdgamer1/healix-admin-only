import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const UsersManagement = () => { 
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
   const token=localStorage.getItem('token')

    const fetchUsers= async ()=>{
      setIsLoading(true);
      setError(null)
    try {
   const response = await fetch(`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/users?page=${page}`,{
      method:"GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
      }

    })
    if(!response.ok) throw new Error("Request Failed")

    const result = await response.json()
    const formatted = result.data.map((item) => ({
      id: item.id,
      fullName: item.full_name,
      email: item.email,
      userType: item.user_type,
      status: item.status,
      attachment: item.attachment,
      createdAt:item.created_at
  }));
  if (result.status==="success"){
    console.log("Users :", result.data)
    setUsers(formatted)
    setLastPage(result.meta.last_page);
  }
    } catch(err){
      console.error("Failed Fetching Users",err)
      setError("Failed to load Users")
    }
    finally{
      setIsLoading(false)
    }
  }

  const ViewAttachments = async (user_id)=>{
    try{
    const response = await fetch (`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/users/${user_id}/attachments`,{

    method :"GET",
    headers:{
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    }
    })
    if(!response.ok) throw new Error("Request Failed")
     const result = await response.json()
    if(result.status==="success"){
      console.log("View :",result.data)
      setAttachments(result.data)
      setIsAttachmentsOpen(true)
    }
    }catch(err){
      console.error("Failed fetching attachments", err)
    }
   }

  
const Approve = async (id)=>{
  try {
    const response = await fetch (`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/users/${id}/approve`,{
      method:"PATCH",
      headers:{
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    }
    })
     if(!response.ok) throw new Error("Request Failed")
     const result = await response.json()
     if(result.status==="success"){
      console.log("Approved :",result.message)
      alert("Account Activated Successfully !")
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: "approved" } : user
        )
      );

    
  }
  } catch(err){
    console.error("Failed Approving Account",err)
}}

const Reject = async(id)=>{
  try {
    const response = await fetch (`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/users/${id}/reject`,{
      method:"PATCH",
      headers:{
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
      }
      })
      if(!response.ok) throw new Error("Request Failed")
      const result = await response.json()
      if(result.status==="success"){
       console.log("Account Declined :",result.message)
       alert("Account Rejected Successfully !")
       setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }
} catch(err){
  console.error("Failed Rejecting Account",err)
}}

const openEditModal = (user) => {
  setEditFullName(user.fullName);
  setEditEmail(user.email);
  setEditUserId(user.id);
  setIsEditOpen(true);
};

const submitEdit = async()=>{
  try {
    const response = await fetch(`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/users/${editUserId}/edit`,{
      method:"PUT",
      headers:{
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
       body: JSON.stringify({
        full_name: editFullName,
        email: editEmail,
      }),
      })
      if(!response.ok) throw new Error("Request Failed")
      const result = await response.json()
      if(result.status==="success"){
        console.log("Editing Account :",result.message) 
        alert("Account Updated Successfully !")
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === editUserId
              ? { ...user, fullName: editFullName, email: editEmail }
              : user
          )
        );
        setEditEmail("")
        setEditFullName("")
        setIsEditOpen(false)
  }
} catch(err){
  console.error("Failed Editing Account",err)
}}

const Delete = async (id)=> {

  try{
    const response = await fetch(`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/users/${id}/delete`,{
      method:"DELETE",
      headers:{
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
      },
    })
    if(!response.ok) throw new Error("Request Failed")
    const result = await response.json()
    if(result.status==="success"){
      console.log("Deleting Account :",result.message) 
      alert("Account Deleted Successfully !")
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  }
} catch(err){
  console.error("Failed Deleting Account",err)
}}

  useEffect(()=>{
    fetchUsers()
    setIsAttachmentsOpen(false);
  },[page])

  return (
    <>
      <h1 className="text-2xl font-bold text-[#052443] mb-6">
        Users Management
      </h1>    
      <div className="bg-white rounded-xl shadow">
      {isLoading && (
        <p className="text-center text-gray-500 mb-6">Loading...</p>
      )}
      {error&& (
      <p className="text-center text-red-500">{error}</p>
       )}
        
        <table className="w-full text-sm text-left">
          <thead className="bg-[#eaf7f7] text-gray-700">
            <tr>
              <th className="p-4">ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Attachments</th>
              <th>Date</th>
              <th>Action</th>
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
                    onClick={()=>ViewAttachments(user.id)}
                    className="text-[#39CCCC] border border-[#39CCCC] px-3 py-1 rounded-lg">
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              
                 <td>
                {new Date(user.createdAt).toLocaleDateString()}
                    </td>


                <td className="flex gap-2 py-3">
                  {user.status!=="approved" ? (
                    <>
                      <button 
                      onClick={()=>Approve(user.id)}
                      className="px-3 py-1 bg-[#39CCCC] text-white rounded-lg">
                        Activate
                      </button>
                      <button
                       onClick={()=>Reject(user.id)}
                      className="px-3 py-1 border border-red-400 text-red-500 rounded-lg">
                        Decline
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                      onClick={()=>openEditModal(user)}
                      className="px-3 py-1 border border-gray-400 rounded-lg">
                        Edit
                      </button>
                      <button
                      onClick={()=>Delete(user.id)}
                      className="px-3 py-1 border border-red-400 text-red-500 rounded-lg">
                        Delete
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
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
      {isAttachmentsOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-[400px]">
      <h2 className="text-lg font-semibold mb-4">User Attachments</h2>

      {attachments.length === 0 ? (
        <p className="text-gray-500 text-sm">No attachments found</p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((file) => (
            <li key={file.id} className="flex justify-between items-center">
              <span className="text-sm"> Category : {file.category} </span>
              <span className="text-sm"> File Name :  {file.file_name}</span>
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 text-sm"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setIsAttachmentsOpen(false)}
        className="mt-4 w-full border border-gray-300 rounded-lg py-1"
      >
        Close
      </button>
    </div>
  </div>
)}

{isEditOpen&&(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-[400px]">
      <h2 className="text-lg font-semibold mb-4">Edit User</h2>

      <label className="block mb-2 text-sm">Full Name:</label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-4"
        value={editFullName || ""}
        onChange={(e) => setEditFullName(e.target.value)}
      />

      <label className="block mb-2 text-sm">Email:</label>
      <input
        type="email"
        className="w-full border rounded px-2 py-1 mb-4"
        value={editEmail || ""}
        onChange={(e) => setEditEmail(e.target.value)}
      />
       <button
              onClick={submitEdit}
              className="px-4 py-2 bg-[#39CCCC] text-white rounded-lg mr-2"
            >
              Save
            </button>
            <button
              onClick={() =>{
                setEditEmail("")
                setEditFullName("")
                setIsEditOpen(false)}}
              className="px-4 py-2 border border-gray-400 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersManagement;
