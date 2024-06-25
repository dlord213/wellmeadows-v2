import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import serveSupabaseClient from "../client/client";
import { faPlus, faUserClock } from "@fortawesome/free-solid-svg-icons";

function DashboardWardDetails(props) {
  const { staffAllocated, staffsInWard, staff } = props;

  const [visibleIndex, setVisibleIndex] = useState(null);
  const [isChargeNurse, setIsChargeNurse] = useState(null);
  const [isHistoryVisible, setHistoryVisibility] = useState(false);
  const [staffsScheduleHistory, setStaffsScheduleHistory] = useState(null);

  const [scheduleFormData, setScheduleFormData] = useState({
    shift: "",
    staff_number: "",
    ward_number: "",
    supply_id: "",
    previousShift: "",
  });

  const [isScheduleUpdateProcessing, setIsScheduleUpdateProcessing] =
    useState(false);

  const handleEditOnClick = (index, data) => {
    setVisibleIndex(index);
    setScheduleFormData({
      shift: "",
      staff_number: data.staff_number || "",
      ward_number: data.ward_number || "",
      supply_id: data.supply_id || null,
      previousShift: data.shift || "",
    });
  };

  const handleScheduleUpdateChange = (e) => {
    const { name, value, checked, type } = e.target;
    setScheduleFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleScheduleUpdateSubmit = async (e) => {
    e.preventDefault();

    setIsScheduleUpdateProcessing(true);

    if (scheduleFormData.supply_id == null) {
      const {
        data: previousScheduleData,
        error: queryInsertPreviousScheduleError,
      } = await serveSupabaseClient.from("allocation_history").insert({
        shift: scheduleFormData.previousShift,
        staff_number: scheduleFormData.staff_number,
        ward_number: scheduleFormData.ward_number,
        supply_id: scheduleFormData.supply_id,
      });

      if (queryInsertPreviousScheduleError) {
        console.error(queryInsertPreviousScheduleError.message);
        setIsScheduleUpdateProcessing(false);

        return;
      }
    } else {
      const {
        data: previousScheduleData,
        error: queryInsertPreviousScheduleError,
      } = await serveSupabaseClient.from("allocation_history").insert({
        shift: scheduleFormData.previousShift,
        staff_number: scheduleFormData.staff_number,
        ward_number: scheduleFormData.ward_number,
      });

      if (queryInsertPreviousScheduleError) {
        console.error(queryInsertPreviousScheduleError.message);
        setIsScheduleUpdateProcessing(false);
        return;
      }
    }

    const { data: updatedScheduleData, error: queryUpdateScheduleError } =
      await serveSupabaseClient
        .from("allocation")
        .update({ shift: scheduleFormData.shift })
        .eq("staff_number", scheduleFormData.staff_number)
        .eq("ward_number", scheduleFormData.ward_number);

    if (queryUpdateScheduleError) {
      console.error(queryUpdateScheduleError.message);
      setIsScheduleUpdateProcessing(false);

      return;
    }

    console.log(scheduleFormData);
    setIsScheduleUpdateProcessing(false);

    setVisibleIndex(null);
  };

  const fetchHistoryStaff = async (ward_number) => {
    const { data, error } = await serveSupabaseClient
      .from("allocation_history")
      .select("*, staff (*)")
      .eq("ward_number", ward_number);

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);

    setStaffsScheduleHistory(data);
  };

  useEffect(() => {
    if (staff.staff_position == "Charge Nurse") {
      fetchHistoryStaff(staffAllocated.ward.ward_number);
      setIsChargeNurse(true);
    } else {
      setIsChargeNurse(false);
    }
  }, [staff]);

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-slate-200 rounded-lg p-4">
        <h1 className="font-[700] text-slate-800 text-4xl">
          {staffAllocated.ward.ward_name} ({staffAllocated.ward.location} -{" "}
          {staffAllocated.ward.telephone_ext_number})
        </h1>
        {isChargeNurse ? (
          <button
            type="submit"
            className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg w-[40px] hover:w-[121px] group flex items-center transition-all duration-300 ease-in-out h-[42px]"
            onClick={() => setHistoryVisibility((prevCheck) => !prevCheck)}
          >
            <FontAwesomeIcon icon={faUserClock} />
            <span className="hidden group-hover:inline-block ml-2 transition-all duration-300 delay-1000 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
              History
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 text-slate-800">
        {staffsInWard.map((data, index) => (
          <div
            className="flex flex-row gap-4 justify-between items-center p-4 bg-slate-100 rounded-lg"
            key={data.staff_number}
          >
            <div className="flex flex-row gap-4 items-center">
              <FontAwesomeIcon icon={faUser} className="text-5xl" />
              <div className="flex flex-col">
                <h1 className="font-[700] text-xl">
                  {data.staff.firstname} {data.staff.lastname}
                </h1>
                <p className="text-slate-500">
                  {data.staff.staff_position} ({data.shift}) -{" "}
                  {data.staff.telephone_number}
                </p>
              </div>
            </div>
            {isChargeNurse
              ? data.staff.staff_position != "Charge Nurse" && (
                  <>
                    {visibleIndex !== index ? (
                      <button
                        className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg group flex items-center transition-all duration-300 ease-in-out"
                        onClick={() => handleEditOnClick(index, data)}
                      >
                        Edit schedule
                      </button>
                    ) : (
                      <form
                        className="flex flex-row gap-2"
                        onSubmit={(e) =>
                          handleScheduleUpdateSubmit(
                            e,
                            data.staff_number,
                            data.ward_number,
                            data.supply_id,
                            data.shift
                          )
                        }
                      >
                        {isScheduleUpdateProcessing ? (
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-slate-700 text-4xl animate-spin"
                          />
                        ) : (
                          <>
                            <select
                              name="shift"
                              onChange={handleScheduleUpdateChange}
                              className="rounded-lg px-4"
                              value={scheduleFormData.shift}
                            >
                              <option value="">Select Shift</option>
                              <option value="Early">Early</option>
                              <option value="Night">Night</option>
                              <option value="Late">Late</option>
                            </select>
                            <input
                              type="submit"
                              className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg group flex items-center transition-all duration-300 ease-in-out"
                              value="Update"
                            />
                          </>
                        )}
                      </form>
                    )}
                  </>
                )
              : null}
          </div>
        ))}
      </div>

      {staffsScheduleHistory != null ? (
        <div
          className={
            isHistoryVisible
              ? "flex flex-col gap-2 text-slate-800 my-4"
              : "hidden"
          }
        >
          <h1 className="font-[700] text-slate-800 text-4xl bg-slate-200 rounded-lg p-4">
            History
          </h1>
          {staffsScheduleHistory.map((data, index) => (
            <div
              className="flex flex-row gap-4 justify-between items-center p-4 bg-slate-100 rounded-lg"
              key={data.staff_number}
            >
              <div className="flex flex-row gap-4 items-center">
                <FontAwesomeIcon icon={faUser} className="text-5xl" />
                <div className="flex flex-col">
                  <h1 className="font-[700] text-xl">
                    {data.staff.firstname} {data.staff.lastname}
                  </h1>
                  <p className="text-slate-500">
                    {data.staff.staff_position} ({data.shift}) -{" "}
                    {data.staff.telephone_number}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default DashboardWardDetails;
