import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import serveSupabaseClient from "../client/client";
import { useNavigate } from "react-router-dom";

function DashboardHeader(props) {
  const { staffData } = props;

  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();

    const { error } = await serveSupabaseClient.auth.signOut();
    if (error) {
      console.error("Error during logout:", error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-row justify-between p-4 gap-2 items-center bg-slate-200 text-slate-800 rounded-lg my-4">
      <div className="flex flex-row items-center gap-4 text-slate-700">
        <FontAwesomeIcon icon={faUserCircle} className="text-6xl " />
        <div className="flex flex-col">
          <h1 className="font-[700] text-xl">
            {staffData.firstname} {staffData.lastname}
          </h1>
          <p className="text-slate-500">
            {staffData.staff_position == null
              ? "Not activated"
              : staffData.staff_position}
          </p>
        </div>
      </div>
      <form className="flex" onSubmit={handleLogout}>
        <button
          type="submit"
          className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600  rounded-lg w-[40px] hover:w-[114px] group flex items-center transition-all duration-300 ease-in-out h-[48px]"
        >
          <FontAwesomeIcon icon={faRightToBracket} className="text-slate-50" />
          <span className="hidden group-hover:inline-block ml-2 text-slate-500 group-hover:text-slate-50 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
            LOGOUT
          </span>
        </button>
      </form>
    </div>
  );
}
export default DashboardHeader;
