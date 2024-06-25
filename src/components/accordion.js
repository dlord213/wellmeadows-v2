import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Accordion(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { appointment } = props;

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        className="flex flex-row justify-between items-center"
        key={appointment.patient.patient_number}
      >
        <h1 className="font-[500] text-slate-800">
          {appointment.patient.firstname} {appointment.patient.lastname}
        </h1>
        <button
          type="button"
          onClick={toggleAccordion}
          className="cursor-pointer p-3 uppercase font-[500] text-slate-800 transition-all duration-300 ease-in-out"
        >
          <FontAwesomeIcon
            icon={faArrowDown}
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div
        className={`flex flex-col bg-slate-50 rounded-lg py-2 px-4 transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "h-[640px] text-slate-800" : "h-[0px]"
        }`}
      >
        {isExpanded && (
          <>
            <h1 className="mt-4 text-2xl font-[700]">Patient Details</h1>
            <hr className="my-4 "></hr>
            <p>
              <b>Appointment date:</b>{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(appointment.appointment_timestamp))}
            </p>
            <p>
              <b>Room: </b> {appointment.room}
            </p>
            <p>
              <b>Address: </b> {appointment.patient.address}
            </p>
            <p>
              <b>Marital Status: </b> {appointment.patient.marital_status}
            </p>
            <p>
              <b>Telephone Number: </b> {appointment.patient.telephone_number}
            </p>
            <p>
              <b>Date Registered: </b> {appointment.patient.date_registered}
            </p>
            <p>
              <b>Date of Birth: </b> {appointment.patient.date_of_birth}
            </p>
            <hr className="my-4"></hr>
            <h1 className="text-2xl font-[700]">Doctor Details</h1>
            <hr className="my-4"></hr>
            <p>
              <b>{appointment.patient.doctor.fullname}</b>
            </p>
            <p>
              <b>Address: </b> {appointment.patient.doctor.address}
            </p>
            <p>
              <b>Telephone Number: </b>{" "}
              {appointment.patient.doctor.telephone_number}
            </p>
            <hr className="my-4"></hr>
            <h1 className="text-2xl font-[700]">Kin Details</h1>
            <hr className="my-4"></hr>
            <p>
              <b>{appointment.patient.kin.kin_name}</b>
            </p>
            <p>
              {" "}
              <b>Relationship: </b> {appointment.patient.kin.relationship}
            </p>
            <p>
              <b>Address: </b> {appointment.patient.kin.address}
            </p>
            <p>
              <b>Telephone Number: </b>{" "}
              {appointment.patient.kin.telephone_number}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default Accordion;
