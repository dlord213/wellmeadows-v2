import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DashboardStaffDetails(props) {
  const { staff } = props;

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-slate-200 rounded-lg p-4">
        <h1 className="font-[700] text-slate-800 text-4xl">Staff Details</h1>
        <button
          type="submit"
          className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg w-[40px] hover:w-[84px] group flex items-center transition-all duration-300 ease-in-out h-[42px]"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          <span className="hidden group-hover:inline-block ml-2 transition-all duration-300 delay-1000 ease-in-out opacity-0 group-hover:opacity-100">
            EDIT
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-2 text-slate-800">
        <p>
          <b>Address:</b> {staff.address}
        </p>
        <p>
          <b>Date of Birth:</b> {staff.date_of_birth}
        </p>
        <p>
          <b>National Insurance Number: </b> {staff.national_insurance_number}
        </p>
        <p>
          <b>Gender:</b> {staff.sex}
        </p>
        <p>
          <b>Telephone Number:</b> {staff.telephone_number}
        </p>
        <p>
          <b>Position:</b>{" "}
          {staff.staff_position == null
            ? "This staff does not have any position yet."
            : staff.staff_position}
        </p>
        <p>
          <b>Current Salary:</b>{" "}
          {staff.current_salary == null
            ? "This staff does not have a salary set yet."
            : `${new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              })
                .format(staff.current_salary)
                .replace("PHP", "")}`}
        </p>
      </div>
    </>
  );
}

export default DashboardStaffDetails;
