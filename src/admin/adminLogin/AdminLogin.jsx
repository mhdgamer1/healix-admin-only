import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoImage from "../../Components/logoImage/LogoImage";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const { t, i18n } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("adminLang", newLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);
    const user = {
      email: newUser.email,
      password: newUser.password,
    };
    console.log("user's data: ", user);
    fetch(`https://unjuicy-schizogenous-gibson.ngrok-free.dev/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((serverError) => {
            throw new Error(serverError.message || t("adminLogin.loginFailed"));
          });
        }
        console.log("success sending user's data ");
        return response.json();
      })
      .then((data) => {
        console.log("message from api: ", data.message);
        localStorage.setItem("token", data.token);
        navigate('/admin-dashboard/statistics');
        setSuccessMsg(t("adminLogin.loginSuccess"));
        setNewUser({
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        setError(error.message || t("adminLogin.loginFailedRetry"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="relative flex h-screen">
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-4 left-4 z-10 text-sm text-[var(--cyan)] font-semibold px-3 py-1.5 rounded-lg border border-[var(--cyan)] hover:bg-cyan-50 transition"
      >
        {i18n.language === "en" ? "العربية" : "English"}
      </button>

      <div className={`contentCol h-[100%]`}>
        <div className="flex items-start md:py-[2rem] py-[1rem] sm:px-[2rem] ps-[0.5rem] h-[100%]">
          {/* form  */}
          <div className="flex-grow-1 flex flex-col items-center self-center">
            <div className={`${styles.formHeading} text-center `}>
              <h1 className="md:text-[25px] sm:text-[20px] text-[18px] text-[var(--dark-blue)] font-bold">
                {t("adminLogin.title")} <span className="text-[var(--cyan)]">{t("adminLogin.titleCyan")}</span>
              </h1>
              <p className="font-medium sm:text-[18px] text-[var(--text-color)] my-[1rem]">
                {t("adminLogin.subtitle")}
              </p>
            </div>

            {error ? (
              <div className="w-full text-center text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm font-medium">
                {error}
              </div>
            ) : ""}
            {successMsg ? (
              <div className="w-full text-center text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4 text-sm font-medium">
                {successMsg}
              </div>
            ) : ""}

            <form
              className={`${styles.form} flex flex-col gap-[1.5rem] lg:w-[80%] w-[90%]`}
              onSubmit={handleSubmit}
            >
              {/* email  */}
              <div className="md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] flex items-center gap-[0.5rem] basis-0 grow border-1 border-[var(--card-border)] rounded-[8px]">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} className="sm:text-[30px] text-[20px] text-[var(--cyan)]" />
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={t("adminLogin.emailPlaceholder")}
                  className="flex-grow-1"
                  value={newUser.email}
                  ref={inputRef}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              {/* password  */}
              <div className="basis-0 grow md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] flex items-center border-1 border-[var(--card-border)] rounded-[8px]">
                <div className="flex items-center gap-[0.5rem] basis-0 grow">
                  <label htmlFor="pass">
                    <FontAwesomeIcon icon={faLock} className="sm:text-[30px] text-[20px] text-[var(--cyan)]" />
                  </label>
                  <input
                    name="pass"
                    id="pass"
                    type={passwordShown ? "text" : "password"}
                    placeholder={t("adminLogin.passwordPlaceholder")}
                    className="flex-grow-1"
                    value={newUser.password}
                    autoComplete="off"
                    onInput={(e) =>
                      setNewUser({
                        ...newUser,
                        password: e.target.value,
                      })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="pass-icon">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="cursor-pointer text-[var(--text-color)] md:text-[20px] text-[18px]"
                    onClick={() => setPasswordShown(!passwordShown)}
                  />
                </div>
              </div>
              {/* login button  */}
              <button
                type="submit"
                className="rounded-[8px] sm:p-[1.5rem] p-[1rem] bg-[var(--dark-blue)] text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-[0px_3px_8px_#2d2d2de3] duration-200 hover:bg-[#0a3460]"
                disabled={isLoading}
              >
                {t("adminLogin.loginBtn")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <LogoImage />
    </div>
  );
};

export default AdminLogin;