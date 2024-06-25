import { useNavigate } from "react-router-dom";
import serveSupabaseClient from "./client/client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DashboardHeader from "./components/dashboard_header";
import DashboardStaffDetails from "./components/dashboard_staff_details";
import DashboardContractDetails from "./components/dashboard_contract_details";
import DashboardSidebar from "./components/dashboard_sidebar";
import DashboardWardDetails from "./components/dashboard_ward_details";
import DashboardAppointments from "./components/dashboard_appointments";
import DashboardPatients from "./components/dashboard_patients";

import MovingBackground from "./components/moving_background";

function DashboardPage() {
  const navigate = useNavigate();

  const [hasCurrentSession, setCurrentSession] = useState(null);
  const [staff, setStaff] = useState(null);
  const [staffsInWard, setStaffsInWard] = useState(null);
  const [staffAllocated, setStaffAllocated] = useState(null);
  const [appointments, setAppoinments] = useState(null);
  const [patientsInWard, setPatientsInWard] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [showContractNotification, setContractNotificationState] =
    useState(false);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pages = [
    <DashboardStaffDetails staff={staff} />,
    <DashboardContractDetails
      staff={staff}
      showContractNotification={showContractNotification}
      setContractNotificationState={setContractNotificationState}
    />,
    <DashboardWardDetails
      staff={staff}
      staffAllocated={staffAllocated}
      staffsInWard={staffsInWard}
    />,
    <DashboardAppointments appointments={appointments} />,
    <></>,
    <DashboardPatients
      patientsInWard={patientsInWard}
      staffAllocated={staffAllocated}
    />,
  ];

  const fetchDatas = async (user) => {
    const { data: staffUserData, error: queryStaffUserDataError } =
      await serveSupabaseClient
        .from("staff_user")
        .select("staff_number")
        .eq("email", user.email)
        .single();

    if (queryStaffUserDataError) {
      console.error(
        "Error fetching staff_user data:",
        queryStaffUserDataError.message
      );
      return;
    }

    const { data: staffData, error: queryStaffDataError } =
      await serveSupabaseClient
        .from("staff")
        .select(
          "*, contract (hours_worked_per_week, paid_type, contract_type), experience (starting_date, finished_date, position, organization), qualification (qualification_date, qualification_type, institution_name)"
        )
        .eq("staff_number", staffUserData.staff_number)
        .single();

    if (queryStaffDataError) {
      console.error("Error fetching staff data:", queryStaffDataError.message);
      return;
    } else {
      setStaff(staffData);
    }

    const { data: allocationData, error: queryAllocationStaffError } =
      await serveSupabaseClient
        .from("allocation")
        .select("ward (*), supplies (*), shift")
        .eq("staff_number", staffUserData.staff_number)
        .single();

    if (queryAllocationStaffError) {
      console.error(
        "Error fetching staff data:",
        queryAllocationStaffError.message
      );
      return;
    } else {
      setStaffAllocated(allocationData);
    }

    const { data: staffsInWardData, error: queryStaffInWardsError } =
      await serveSupabaseClient
        .from("allocation")
        .select("staff (*), *")
        .eq("ward_number", allocationData.ward.ward_number);

    if (queryStaffInWardsError) {
      console.error(
        "Error fetching staff data:",
        queryStaffInWardsError.message
      );
      return;
    } else {
      setStaffsInWard(staffsInWardData);
      console.log(staffsInWardData);
    }

    const { data: patientsInWardData, error: queryPatientsInWardError } =
      await serveSupabaseClient
        .from("inpatient")
        .select(
          `
        bed_number,
        allocation (*),
        appointment_number,
        waiting_list_date,
        expected_stay,
        date_placed,
        date_expected_to_leave,
        date_actual_left,
        appointment (
          appointment_number,
          patient_number,
          appointment_timestamp,
          room,
          patient:patient_number (
            patient_number,
            firstname,
            lastname,
            address,
            sex,
            date_of_birth,
            telephone_number,
            date_registered,
            marital_status,
            kin_id,
            doctor_id
          )
        )
      `
        )
        .eq("allocation.ward_number", allocationData.ward.ward_number);

    if (queryPatientsInWardError) {
      console.error(
        "Error fetching staff data:",
        queryPatientsInWardError.message
      );
      return;
    } else {
      setPatientsInWard(patientsInWardData);
    }

    const { data: appointmentData, error: queryAppointmentError } =
      await serveSupabaseClient
        .from("appointment")
        .select(
          "patient (*, doctor (fullname, address, telephone_number), kin (kin_name, relationship, address, telephone_number) ), room, appointment_timestamp"
        )
        .eq("staff_number", staffUserData.staff_number);

    if (queryAppointmentError) {
      console.error(
        "Error fetching staff data:",
        queryAppointmentError.message
      );
      return;
    } else {
      setAppoinments(appointmentData);
      setIsDataFetched(true);
    }
  };

  const handleRedirection = async () => {
    const { data: sessionUser } = await serveSupabaseClient.auth.getSession();

    if (sessionUser.session == null) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      const user = sessionUser.session.user;
      setCurrentSession(user);
      fetchDatas(user);
    }
  };

  useEffect(() => {
    if (hasCurrentSession == null) {
      handleRedirection();
    }
  }, [hasCurrentSession]);

  return (
    <>
      <MovingBackground />
      {isDataFetched ? (
        <div className="flex flex-col max-w-7xl mx-auto">
          <DashboardHeader staffData={staff} />
          <div className="flex flex-row gap-4 relative">
            <DashboardSidebar
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
            />
            <div className="basis-[80%] flex flex-col gap-2">
              {pages[currentPageIndex]}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center h-[100vh] max-h-full max-w-full items-center">
          <FontAwesomeIcon
            icon={faPlus}
            className="text-slate-700 text-[6em] animate-spin"
          />
        </div>
      )}
    </>
  );
}

export default DashboardPage;
