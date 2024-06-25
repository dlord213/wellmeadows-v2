import {
  faCheckCircle,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import serveSupabaseClient from "../client/client";

function DashboardContractDetails(props) {
  const { staff, showContractNotification, setContractNotificationState } =
    props;

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-slate-200 rounded-lg p-4">
        <h1 className="font-[700] text-slate-800 text-4xl">Contract</h1>
        {staff.contract_id == null ? (
          <button
            type="submit"
            className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg w-[40px] hover:w-[172px] group flex items-center transition-all duration-300 ease-in-out h-[42px]"
            onClick={() => {
              setContractNotificationState(true);
              setTimeout(() => {
                setContractNotificationState(false);
              }, 2000);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            <span className="hidden group-hover:inline-block ml-2 transition-all duration-300 delay-1000 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
              Get contract
            </span>
          </button>
        ) : null}
      </div>
      {staff.contract_id == null ? (
        <h1 className="text-slate-800 font-[500]">No contract.</h1>
      ) : (
        <div className="flex flex-col gap-2 text-slate-800">
          <p>
            <b>Hours worked per week: </b>
            {staff.contract.hours_worked_per_week == null
              ? "No hours worked per week yet."
              : `${staff.contract.hours_worked_per_week}/hr`}
          </p>
          <p>
            <b>Contract Type: </b>
            {staff.contract.contract_type == "P" ? "Permanent" : "Temporary"}
          </p>
          <p>
            <b>Paid Type: </b>
            {staff.contract.paid_type == "W" ? "Weekly" : "Monthly"}
          </p>
        </div>
      )}

      {showContractNotification && (
        <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 backdrop-brightness-50">
          <p className="bg-slate-200 p-4 rounded-lg text-lg text-slate-800">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> The system
            administrator will be notified.
          </p>
        </div>
      )}
    </>
  );
}

export default DashboardContractDetails;
