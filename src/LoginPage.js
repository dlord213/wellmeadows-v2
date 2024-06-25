import { useState, useEffect } from "react";
import serveSupabaseClient from "./client/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import MovingBackground from "./components/moving_background";

function LoginPage() {
  const navigate = useNavigate();

  const [loginErrorState, setLoginErrorState] = useState(null);
  const [errorMessage, setErrorMessage] = useState("DEFAULT");

  const [currentLoginDisplayIndex, setLoginDisplayIndex] = useState(0);

  const [hasCurrentSession, setCurrentSession] = useState(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCredentials((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginDisplayIndex(1);

    const { data: loginData, error: loginError } =
      await serveSupabaseClient.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

    if (loginError) {
      setLoginDisplayIndex(0);
      setLoginErrorState(true);
      setErrorMessage(loginError.message);
    } else {
      navigate("/dashboard");
    }
  };

  const loginDisplays = [
    <>
      <MovingBackground />
      <div className="flex flex-col max-h-[100vh] min-h-[100vh] justify-center ml-[10vw] max-w-lg gap-4">
        <div className="flex flex-col">
          <h1 className="font-[700] text-4xl text-slate-800">
            Wellmeadows Hospital
          </h1>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            required
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            className="p-4 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            required
          />
          <input
            type="submit"
            value="Login"
            className="cursor-pointer p-3 uppercase font-[500] bg-slate-500 hover:bg-slate-600 text-slate-50 rounded-lg"
          />
        </form>
        {loginErrorState == true ? (
          <p className="bg-red-500 p-4 text-white rounded-lg">
            <FontAwesomeIcon icon={faWarning} /> {errorMessage}
          </p>
        ) : null}
        <div className="flex flex-row justify-between">
          <a href="./sign-up" className="text-slate-400 hover:text-slate-600">
            Don't have an account?
          </a>
          <a href="./forgot-account" className="text-red-500">
            Forgot your credentials?
          </a>
        </div>
      </div>
    </>,
    <>
      <MovingBackground />
      <div className="flex justify-center h-[100vh] max-h-full max-w-full items-center">
        <FontAwesomeIcon
          icon={faPlus}
          className="text-slate-700 text-[6em] animate-spin"
        />
      </div>
    </>,
  ];

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

    if (loginErrorState) {
      const timer = setTimeout(() => {
        setLoginErrorState(null);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (hasCurrentSession == null) {
      handleRedirection();
    }
  }, [loginErrorState, hasCurrentSession, navigate]);

  return (
    <>
      {hasCurrentSession == null
        ? loginDisplays[1]
        : loginDisplays[currentLoginDisplayIndex]}
    </>
  );
}

export default LoginPage;
