import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone } from "@fortawesome/free-solid-svg-icons";



export default function ContactModal({ isOpen, onClose, patient }) {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold mb-4">Contact Patient</h2>
        <p className="mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-cyan-500" />
          <span className="font-medium text-gray-500">Name:</span> {patient.patientName}
        </p>


        <p className="mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPhone} className="text-cyan-500" />
          <span className="font-medium text-gray-500">Phone:</span> {patient.patientPhone || "+963xxxxxx"}
        </p>

        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
