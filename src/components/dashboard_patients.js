import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DashboardPatients(props) {
  const { patientsInWard, staffAllocated } = props;

  return (
    <div className="flex flex-col gap-2 text-slate-800">
      <div className="flex flex-row justify-between items-center bg-slate-200 rounded-lg p-4">
        <h1 className="font-[700] text-slate-800 text-4xl">
          {staffAllocated.ward.ward_name} ({staffAllocated.ward.location} -{" "}
          {staffAllocated.ward.telephone_ext_number})
        </h1>
      </div>
      {patientsInWard.map((data) => (
        <div
          className="flex flex-row gap-4 items-center p-4 bg-slate-100 rounded-lg"
          key={data.appointment.patient.patient_number}
        >
          <FontAwesomeIcon icon={faUser} className="text-5xl" />
          <div className="flex flex-col">
            <h1 className="font-[700] text-xl">
              {data.appointment.patient.firstname}{" "}
              {data.appointment.patient.lastname}
            </h1>
            <p className="text-slate-500">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(data.appointment.appointment_timestamp))}{" "}
              - {data.appointment.patient.telephone_number}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardPatients;
