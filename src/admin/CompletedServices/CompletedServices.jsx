import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronLeft, faChevronRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ContactModal from "../ContactModal/ContactModal";

export default function CompletedServices() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  });

  const openModal = (service) => {
    setSelectedPatient(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const token = localStorage.getItem("token");

  const fetchCompletedServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        service_type: "consultation",
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
      });
      const response = await fetch(
        `https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/admin/services?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch completed services");
      const result = await response.json();
      const formatted = result.data.map((item) => ({
        id: item.id,
        patientName: item.patient_name,
        patientPhone: item.patient_phone,
        serviceName: item.service_name,
        providerName: item.service_provider,
        providerType: item.provider_type,
        rating: item.rating,
        date: item.date,
      }));
      setServices(formatted);
      setPagination((prev) => ({ ...prev, totalPages: result.meta.last_page }));
    } catch (err) {
      console.error(err);
      setError(t("completedServices.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedServices();
  }, [pagination.currentPage]);

  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((p) => ({ ...p, currentPage: p.currentPage + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((p) => ({ ...p, currentPage: p.currentPage - 1 }));
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }
  if (isLoading) {
    return <p className="text-center mt-10 text-gray-500">{t("common.loading")}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#052443] mb-6">{t("completedServices.title")}</h1>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <table className="w-full text-sm border-separate border-spacing-y-0.5">
          <thead className="bg-cyan-50 text-[#052443]">
            <tr>
              <th className="p-4 text-left">{t("completedServices.id")}</th>
              <th className="p-4 text-left">{t("completedServices.patientName")}</th>
              <th className="p-4 text-left">{t("completedServices.serviceName")}</th>
              <th className="p-4 text-left">{t("completedServices.provider")}</th>
              <th className="p-4 text-left">{t("completedServices.rating")}</th>
              <th className="p-4 text-left">{t("completedServices.date")}</th>
              <th className="p-4 text-center">{t("completedServices.action")}</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr key={item.id} className="border-b border-blue-100 last:border-none hover:bg-blue-50/40 transition">
                <td className="p-4 font-semibold text-gray-500">{item.id}</td>
                <td className="p-4 text-gray-700">{item.patientName}</td>
                <td className="p-4 text-gray-700">{item.serviceName}</td>
                <td className="p-4 text-gray-700">{item.providerName}</td>
                <td className="p-4">
                  {!item.rating || item.rating === 0 ? (
                    <span className="text-red-500 text-xs font-medium">{t("completedServices.noRating")}</span>
                  ) : (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={
                            i < item.rating
                              ? item.rating >= 4
                                ? "text-green-500"
                                : "text-orange-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-4 text-[#052443] font-medium">{item.date}</td>
                <td className="p-4 text-center">
                  <button
                    className="border border-cyan-400 text-cyan-500 px-4 py-1.5 rounded-full text-xs hover:bg-cyan-50 transition"
                    onClick={() => openModal(item)}
                  >
                    <FontAwesomeIcon icon={faEnvelope} /> {t("completedServices.contact")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={prevPage}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-500"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            {t("common.previous")}
          </button>
          <span className="text-gray-600">
            {pagination.currentPage} {t("common.of")} {pagination.totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 border border-cyan-400 text-cyan-500 rounded-md hover:bg-cyan-50"
          >
            {t("common.next")}
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {selectedPatient && <ContactModal isOpen={isModalOpen} onClose={closeModal} patient={selectedPatient} />}
    </div>
  );
}