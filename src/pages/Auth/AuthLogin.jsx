import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useValidation from "../../hooks/useValidation";
import { showErrorToast, showSuccessToast } from "../../utils/Toasts";
import { LoginClub, LoginUser } from "../../service/MilanApi";
import { Helmet } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import AuthButton from "../../components/Button/AuthButton/AuthButton";
import TopButton from "../../components/Button/AuthButton/TopButton";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import "./AuthPage.css";
import { SetAuthCookies } from "../../utils/Cookies";

const AuthLogin = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("individual");

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setCredentials({
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const validationErrors = useValidation(credentials);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        showErrorToast(error.message);
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      if (userType === "individual") {
        const data = await LoginUser(credentials);
        handleApiResponse(data);
        SetAuthCookies(data);
      } else if (userType === "club") {
        const data = await LoginClub(credentials);
        handleApiResponse(data);
        SetAuthCookies(data);
      }
    }
  };

  const handleApiResponse = (response) => {
    if (response?.status === 201) {
      showSuccessToast(response?.data?.message);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 2000);
    } else {
      showErrorToast(response?.message);
      setCredentials({ ...credentials });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const [passwordType, setPasswordType] = useState("password");

  const passwordToggle = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  return (
    <>
      <Helmet>
        <title>Milan | Login</title>
        <meta
          name="description"
          content="Welcome to the Club's registration page. Provide all the needed credentials and join us."
        />
        <link rel="canonical" href="/" />
      </Helmet>
      <ToastContainer />

      <div className="authpage_godparent">
        <div className="authpage_parent">
          <div className="authpage_leftdiv">
            <TopButton isGoBack={false} GoogleButton={true} />
          </div>

          <div className="authpage_rightdiv authpage_logindiv">
            <TopButton isGoBack={true} />
            <form className="authform" onSubmit={handleSubmit}>
              <h1 className=""> Sign In</h1>
              <div className="authform_container">
                <label htmlFor="userType" className="auth_label">
                  User Type
                </label>
                <div className="user-type-dropdown">
                  <select
                    id="userType"
                    name="userType"
                    value={userType}
                    onChange={handleUserTypeChange}
                    className="form-control user-type-select"
                  >
                    <option value="individual">Individual</option>
                    <option value="club">Charity/Club/NGO</option>
                  </select>
                  <FaChevronDown className="dropdown-icon" />
                </div>
              </div>
              <div className="authform_container mb-4">
                <label htmlFor="email-des" className="auth_label">
                  Email address
                </label>
                <input
                  type="email"
                  className=" form-control "
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  aria-label="Club email"
                  id="email-des"
                  placeholder={
                    userType === "individual"
                      ? "john@example.com"
                      : 'peepal@farm.io"'
                  }
                  data-cy="email"
                />
              </div>

              <div className="authform_container">
                <label htmlFor="password-des" className="auth_label">
                  Password
                </label>
                <input
                  type={passwordType}
                  className=" form-control "
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  id="password-des"
                  placeholder="Strg@Pass#122&&S"
                  data-cy="password"
                />

                <div
                  onClick={passwordToggle}
                  className="toggle-button"
                  style={{ paddingTop: 5 }}
                >
                  {passwordType === "password" ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              <small id="textDemo" className="form-text text-muted"></small>
              <br />

              <AuthButton isLoading={isLoading} goTo="/clubs" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLogin;