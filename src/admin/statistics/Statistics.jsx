import { useEffect, useState } from "react"

const Statistics = () => {

    const [users,setUsers]= useState({});
    const [doctors,setDoctors] = useState([]);
    const [orders,setOrders] =  useState({});
    const [consultations,setConsultations]= useState({})
    const [pending_documents,setpendingDocuments]= useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token')

    const fetchStatistics = async ()=> {
   setIsLoading(true);
   setError(null)
   try {
    const response = await fetch (`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/dashboard`,{
        method: "GET",
        headers:{
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
        },
    }
    ) 
     if(!response.ok) throw new Error ("Request Failed")
     const result = await response.json()
     if (result.status === "success") { 
        console.log("Statistics :", result.data)
      
        setUsers(result.data.users);
        setConsultations(result.data.consultations);
        setOrders(result.data.orders);
        setpendingDocuments(result.data.pending_documents);
        setDoctors(result.data.top_providers);

     }
   } catch(err){
    console.error("Failed fetching Statistics",err)
    setError("Failed to load Statistics")
   } finally{
    setIsLoading(false)
   }
    }
    useEffect(()=>{fetchStatistics()},[])

  return (
    <>
    {/* users  */}
    <div>
    {isLoading && (
        <p className="text-center text-gray-500 mb-6">Loading...</p>
      )}
      {error&& (
      <p className="text-center text-red-500">{error}</p>
       )}
    <h2 className="text-[var(--text-color)] font-medium text-[30px]">Users</h2>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Patients</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{users.patients}</span> 
   
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Doctors</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{users.doctors}</span> 
   
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Pharmacists</h3> 
             <span className="text-[30px] font-bold text-[var(--cyan)]">{users.pharmacists}</span> 

        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Nurse</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{users.nurse}</span> 
  
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Physiotherapist</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{users.physiotherapist}</span> 
  
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Delivery agents</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.delivery_agents}</span> 
   
        </div>
    </div>
    </div>
        {/* Top Doctors  */}
        <div className="my-[2rem] border-[var(--dark-blue)]">
    <h2 className="text-[var(--text-color)] font-medium text-[30px]">Top Doctors</h2>
    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
         {doctors.length >0 && doctors.map((doctor)=>(
                    <div  key={doctor.id}
                    className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
                    <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{doctor.name}</h3>
                    <h3 className="text-[var(--dark-blue)] font-bold text-2xl">Total consultations:</h3>
                    <span className="text-[30px] font-bold text-[var(--cyan)]">{doctor.total_consultations}</span>
                </div>
      ))} 
   
    </div>
    </div>
    {/* consultations  */}
    <div className="my-[2rem] border-[var(--dark-blue)]">
    <h2 className="text-[var(--text-color)] font-medium text-[30px]">Consultations</h2>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Total</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{consultations.total}</span> 
 
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Completed</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{consultations.completed}</span> 
    
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Cancelled</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{consultations.cancelled}</span> 
      
        </div>
    </div>
    </div>
    {/* orders  */}
    <div className="my-[2rem] border-[var(--dark-blue)]">
    <h2 className="text-[var(--text-color)] font-medium text-[30px]">Orders</h2>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Total</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{orders.total}</span> 

        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Delivered</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{orders.delivered}</span> 
  
        </div>
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Pending</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{orders.pending}</span> 

        </div>
    </div>
    </div>
    {/* documents  */}
    <div className="my-[2rem] border-[var(--dark-blue)]">
    <h2 className="text-[var(--text-color)] font-medium text-[30px]">Documents</h2>
    <div className="pt-[2rem] md:px-[5rem] px-[2rem] w-[50%] mx-[auto]">
        <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">Pending documents</h3>
             <span className="text-[30px] font-bold text-[var(--cyan)]">{pending_documents}</span> 

        </div>
    </div>
    </div>
    </>
  )
}

export default Statistics
