import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Accordion from "./accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DashboardAppointments(props) {
  const { appointments } = props;

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-slate-200 rounded-lg p-4">
        <h1 className="font-[700] text-slate-800 text-4xl">Appointments</h1>
        <button
          type="submit"
          className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg w-[40px] hover:w-[199px] group flex items-center transition-all duration-300 ease-in-out h-[42px]"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden group-hover:inline-block ml-2 transition-all duration-300 delay-1000 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
            ADD appointment
          </span>
        </button>
      </div>
      {appointments.map((data) => (
        <Accordion appointment={data} key={data.patient.patient_number} />
      ))}
    </>
  );
}

export default DashboardAppointments;
