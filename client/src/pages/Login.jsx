import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { loginUser, setTokenInLs, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [isDisable, setisDisable] = useState(true);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setisDisable(false);
      const response = await loginUser(user.email, user.password);
      // console.log(response);
      // return false;
      if (response.success) {
        // const completeRes = await response.json();
        const { token } = response.data;
        setTokenInLs(token);
        navigate("/");
        toast.success(
          "Login Successfully"
        );
      } else {
        setisDisable(true);
        // const errorResponse = await response.json();
        toast.error(
          response.message ||
          "Login failed. Invalid credentials or server error."
        );
      }
    } catch (error) {
      console.log("Error on login Page:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <section>
      <main>
        <div className="section-registration">
          <div className="container grid grid-two-cols">
            <div className="registration-image reg-img">
              <img
                src="/images/register.png"
                alt="a nurse with a cute look"
                width="400"
                height="500"
              />
            </div>
            <div className="registration-form">
              <h1 className="main-heading mb-3">Login form</h1>
              <br />
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">email</label>
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder="email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password">password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder="password"
                    required
                  />
                </div>
                <br />
                <button type="submit" disabled={!isDisable}
                  className="add-item__button"
                >
                  Login Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Login;
