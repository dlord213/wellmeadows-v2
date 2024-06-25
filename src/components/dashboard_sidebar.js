import {
  faCalendarCheck,
  faIdCardClip,
  faNotesMedical,
  faPrescription,
  faSheetPlastic,
  faSquareH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DashboardSidebar(props) {
  const { currentPageIndex, setCurrentPageIndex } = props;

  return (
    <div className="sticky top-4 basis-[20%] flex flex-col gap-4 items-start bg-slate-200 rounded-lg p-4 h-full">
      <button
        className={`cursor-pointer hover:text-slate-600 transition-all delay-0 duration-300 hover:translate-x-1 text-slate-800 ${
          currentPageIndex === 0 ? "bg-slate-300 py-2 px-6 rounded-lg" : ""
        }`}
        onClick={() => setCurrentPageIndex(0)}
      >
        <FontAwesomeIcon icon={faIdCardClip} />
        <span className="mr-2"></span> Staff Details
      </button>
      <button
        className={`cursor-pointer hover:text-slate-600 transition-all delay-0 duration-300 hover:translate-x-1 text-slate-800 ${
          currentPageIndex === 1 ? "bg-slate-300 py-2 px-6 rounded-lg" : ""
        }`}
        onClick={() => setCurrentPageIndex(1)}
      >
        <FontAwesomeIcon icon={faSheetPlastic} />
        <span className="mr-2"></span> Contract
      </button>
      <button
        className={`cursor-pointer hover:text-slate-600 transition-all delay-0 duration-300 hover:translate-x-1 text-slate-800 ${
          currentPageIndex === 2 ? "bg-slate-300 py-2 px-6 rounded-lg" : ""
        }`}
        onClick={() => setCurrentPageIndex(2)}
      >
        <FontAwesomeIcon icon={faSquareH} />
        <span className="mr-2"></span> Ward
      </button>
      <button
        className={`cursor-pointer hover:text-slate-600 transition-all delay-0 duration-300 hover:translate-x-1 text-slate-800 ${
          currentPageIndex === 3 ? "bg-slate-300 py-2 px-6 rounded-lg" : ""
        }`}
        onClick={() => setCurrentPageIndex(3)}
      >
        <FontAwesomeIcon icon={faCalendarCheck} />
        <span className="mr-2"></span> Appointment
      </button>
      <button
        className={`cursor-pointer hover:text-slate-600 transition-all delay-0 duration-300 hover:translate-x-1 text-slate-800 ${
          currentPageIndex === 4 ? "bg-slate-300 py-2 px-6 rounded-lg" : ""
        }`}
        onClick={() => setCurrentPageIndex(4)}
      >
        <FontAwesomeIcon icon={faPrescription} />
        <span className="mr-2"></span> Orders
      </button>
      <button
        className={`cursor-pointer hover:text-slate-600 transition-all delay-0 duration-300 hover:translate-x-1 text-slate-800 ${
          currentPageIndex === 5 ? "bg-slate-300 py-2 px-6 rounded-lg" : ""
        }`}
        onClick={() => setCurrentPageIndex(5)}
      >
        <FontAwesomeIcon icon={faNotesMedical} />
        <span className="mr-2"></span> Patients
      </button>
    </div>
  );
}

export default DashboardSidebar;
