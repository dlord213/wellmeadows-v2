import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPlus, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import serveSupabaseClient from "./client/client";

import MovingBackground from "./components/moving_background";

function StaffSignUp() {}

function SignUpPage() {
  const navigate = useNavigate();

  const [signUpErrorState, setSignUpErrorState] = useState(null);
  const [errorMessage, setErrorMessage] = useState("DEFAULT");

  const [hasCurrentSession, setCurrentSession] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    address: "",
    date_of_birth: "",
    telephone_number: "",
    national_insurance_number: "",
    gender: "",
    // WORK EXPERIENCE
    starting_date: "",
    finished_date: "",
    work_experience_position: "",
    work_experience_organization: "",
    // WORK EXPERIENCE

    // QUALIFICATION
    qualification_date: "",
    qualification_type: "",
    institution_name: "",
    // QUALIFICATION
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: signUpData, error: signUpError } =
      await serveSupabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

    if (signUpError) {
      setSignUpErrorState(true);
      setErrorMessage(signUpError.message);
      console.log(signUpError.message);
      return;
    }

    const { data: experienceData, error: insertExperienceError } =
      await serveSupabaseClient
        .from("experience")
        .insert([
          {
            starting_date: formData.starting_date,
            finished_date: formData.finished_date,
            position: formData.work_experience_position,
            organization: formData.work_experience_organization,
          },
        ])
        .select("experience_id")
        .single();

    if (insertExperienceError) {
      setSignUpErrorState(true);
      setErrorMessage(insertExperienceError.message);
      console.log(insertExperienceError.message);
      return;
    }

    const { data: qualificationData, error: insertQualificationError } =
      await serveSupabaseClient
        .from("qualification")
        .insert([
          {
            qualification_date: formData.qualification_date,
            qualification_type: formData.qualification_type,
            institution_name: formData.institution_name,
          },
        ])
        .select("qualification_id")
        .single();

    if (insertQualificationError) {
      setSignUpErrorState(true);
      setErrorMessage(insertQualificationError.message);
      console.log(insertQualificationError.message);
      return;
    }

    const { data: staffData, error: insertStaffError } =
      await serveSupabaseClient
        .from("staff")
        .insert([
          {
            firstname: formData.firstname,
            lastname: formData.lastname,
            address: formData.address,
            sex: formData.gender,
            date_of_birth: formData.date_of_birth,
            telephone_number: formData.telephone_number,
            national_insurance_number: formData.national_insurance_number,
            experience_id: experienceData.experience_id,
            qualification_id: qualificationData.qualification_id,
          },
        ])
        .select("staff_number")
        .single();

    if (insertStaffError) {
      setSignUpErrorState(true);
      setErrorMessage(insertStaffError.message);
      console.log(insertStaffError.message);
      return;
    }

    const { data: staffLoginData, error: insertStaffLoginError } =
      await serveSupabaseClient.from("staff_user").insert([
        {
          email: formData.email,
          staff_number: staffData.staff_number,
        },
      ]);

    if (insertStaffError) {
      setSignUpErrorState(true);
      setErrorMessage(insertStaffError.message);
      console.log(insertStaffError.message);
      return;
    }

    navigate("/dashboard");
  };

  useEffect(() => {
    const handleRedirection = async (e) => {
      const { data } = await serveSupabaseClient.auth.getSession();

      if (data.session == null) {
        setTimeout(() => {
          setCurrentSession(false);
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    };

    if (signUpErrorState) {
      const timer = setTimeout(() => {
        setSignUpErrorState(null);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (hasCurrentSession == null) {
      handleRedirection();
    }
  }, [signUpErrorState, hasCurrentSession, navigate]);

  return (
    <>
      <MovingBackground />
      {hasCurrentSession == false ? (
        <div className="flex flex-col my-8 ml-[10vw] max-w-4xl gap-4 ">
          <div>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-800 py-2 px-8 text-slate-50 rounded-lg"
            >
              <FontAwesomeIcon icon={faHouse} />
            </button>
          </div>
          <div>
            <h1 className="font-[700] text-slate-700 text-4xl">
              Wellmeadows Hospital
            </h1>
            <p className="font-[400] text-slate-400 text-xl">Sign-up</p>
          </div>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            {/* STAFF DETAILS */}
            <div className="flex flex-col gap-2 bg-slate-100 p-4 rounded-lg">
              <h1 className="font-[500] text-slate-500">Staff Details</h1>
              <div className="grid grid-rows-1 grid-cols-4 gap-1">
                <input
                  onChange={handleChange}
                  type="text"
                  name="email"
                  placeholder="E-mail"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
              </div>
              <div className="grid grid-rows-1 grid-cols-4 justify-evenly gap-1">
                <input
                  onChange={handleChange}
                  type="date"
                  name="date_of_birth"
                  placeholder="Birth Date"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="telephone_number"
                  placeholder="Telephone/Phone Number"
                  maxLength="12"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="national_insurance_number"
                  placeholder="National Insurance Number"
                  maxLength="9"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
              </div>
            </div>
            {/* STAFF DETAILS */}

            {/* WORK EXPERIENCE DETAILS */}
            <div className="flex flex-col gap-2 bg-slate-100 p-4 rounded-lg">
              <h1 className="font-[500] text-slate-500">
                Work Experience Details
              </h1>
              <div className="grid grid-rows-1 grid-cols-4 gap-1">
                <div className="flex flex-col relative">
                  <p className="absolute top-[1px] left-4 font-[500] text-slate-400 text-sm">
                    Starting Date
                  </p>
                  <input
                    onChange={handleChange}
                    type="date"
                    name="starting_date"
                    placeholder="Starting Date"
                    className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    required
                  />
                </div>
                <div className="flex flex-col relative">
                  <p className="absolute top-[1px] left-4 font-[500] text-slate-400 text-sm">
                    Finished Date
                  </p>
                  <input
                    onChange={handleChange}
                    type="date"
                    name="finished_date"
                    placeholder="Finished Date"
                    className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    required
                  />
                </div>
                <input
                  onChange={handleChange}
                  type="text"
                  name="work_experience_position"
                  placeholder="Position"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="work_experience_organization"
                  placeholder="Organization"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
              </div>
            </div>
            {/* WORK EXPERIENCE DETAILS */}

            {/* QUALIFICATION DETAILS */}
            <div className="flex flex-col gap-2 bg-slate-100 p-4 rounded-lg">
              <h1 className="font-[500] text-slate-500">
                Qualification Details
              </h1>
              <div className="grid grid-rows-1 grid-cols-3 gap-1">
                <div className="flex flex-col relative">
                  <p className="absolute top-[1px] left-4 font-[500] text-slate-400 text-sm">
                    Qualification Date
                  </p>
                  <input
                    onChange={handleChange}
                    type="date"
                    name="qualification_date"
                    placeholder="Qualification Date"
                    className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    required
                  />
                </div>
                <input
                  onChange={handleChange}
                  type="text"
                  name="qualification_type"
                  placeholder="Qualification Type"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="institution_name"
                  placeholder="Institution Name"
                  className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  required
                />
              </div>
            </div>
            {/* QUALIFICATION DETAILS */}

            {/* GENDER */}
            <div className="flex flex-col my-2">
              <p className="font-[500] text-slate-400">Gender</p>
              <div className="flex flex-row gap-2">
                <input
                  type="radio"
                  value="Male"
                  name="gender"
                  id="male_radio"
                  onChange={handleChange}
                />
                <label htmlFor="male_radio" className="text-slate-500">
                  Male
                </label>
                <input
                  type="radio"
                  value="Female"
                  name="gender"
                  id="female_radio"
                  onChange={handleChange}
                />
                <label htmlFor="female_radio" className="text-slate-500">
                  Female
                </label>
                <input
                  type="radio"
                  value="Other"
                  name="gender"
                  id="other_radio"
                  onChange={handleChange}
                />
                <label htmlFor="other_radio" className="text-slate-500">
                  Other
                </label>
              </div>
            </div>
            {/* GENDER */}

            <input
              type="submit"
              value="Sign-up"
              className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg"
            />
          </form>
          {signUpErrorState == true ? (
            <p className="bg-red-500 p-4 text-white rounded-lg">
              <FontAwesomeIcon icon={faWarning} /> {errorMessage}
            </p>
          ) : null}
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

export default SignUpPage;
