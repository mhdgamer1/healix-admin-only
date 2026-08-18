import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../utils/apiClient";

const Statistics = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [orders, setOrders] = useState({});
  const [consultations, setConsultations] = useState({});
  const [pending_documents, setpendingDocuments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/admin/dashboard`);
      if (!response.ok) throw new Error("Request Failed");
      const result = await response.json();
      if (result.status === "success") {
        console.log("Statistics :", result.data);
        setUsers(result.data.users);
        setConsultations(result.data.consultations);
        setOrders(result.data.orders);
        setpendingDocuments(result.data.pending_documents);
        setDoctors(result.data.top_providers);
      }
    } catch (err) {
      console.error("Failed fetching Statistics", err);
      setError(t("statistics.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <>
      {/* users */}
      <div>
        {isLoading && (
          <p className="text-center text-gray-500 mb-6">{t("common.loading")}</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        <h2 className="text-[var(--text-color)] font-medium text-[30px]">
          {t("statistics.users")}
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.patients")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.patients}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.doctors")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.doctors}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.pharmacists")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.pharmacists}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.nurse")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.nurse}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.physiotherapist")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.physiotherapist}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.deliveryAgents")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{users.delivery_agents}</span>
          </div>
        </div>
      </div>

      {/* Top Doctors */}
      <div className="my-[2rem] border-[var(--dark-blue)]">
        <h2 className="text-[var(--text-color)] font-medium text-[30px]">
          {t("statistics.topDoctors")}
        </h2>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
          {doctors.length > 0 &&
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]"
              >
                <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{doctor.name}</h3>
                <h3 className="text-[var(--dark-blue)] font-bold text-2xl">
                  {t("statistics.totalConsultations")}
                </h3>
                <span className="text-[30px] font-bold text-[var(--cyan)]">
                  {doctor.total_consultations}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* consultations */}
      <div className="my-[2rem] border-[var(--dark-blue)]">
        <h2 className="text-[var(--text-color)] font-medium text-[30px]">
          {t("statistics.consultations")}
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.total")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{consultations.total}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.completed")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{consultations.completed}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.cancelled")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{consultations.cancelled}</span>
          </div>
        </div>
      </div>

      {/* orders */}
      <div className="my-[2rem] border-[var(--dark-blue)]">
        <h2 className="text-[var(--text-color)] font-medium text-[30px]">
          {t("statistics.orders")}
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[2rem] pt-[2rem] md:px-[5rem] px-[2rem]">
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.total")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{orders.total}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.delivered")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{orders.delivered}</span>
          </div>
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">{t("statistics.pending")}</h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{orders.pending}</span>
          </div>
        </div>
      </div>

      {/* documents */}
      <div className="my-[2rem] border-[var(--dark-blue)]">
        <h2 className="text-[var(--text-color)] font-medium text-[30px]">
          {t("statistics.documents")}
        </h2>
        <div className="pt-[2rem] md:px-[5rem] px-[2rem] w-[50%] mx-[auto]">
          <div className="bg-white shadow-[0px_0px_10px_#00000021] py-4 rounded-lg flex flex-col items-center gap-[1rem]">
            <h3 className="text-[var(--dark-blue)] font-bold text-3xl">
              {t("statistics.pendingDocuments")}
            </h3>
            <span className="text-[30px] font-bold text-[var(--cyan)]">{pending_documents}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;