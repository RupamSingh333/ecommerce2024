import * as React from 'react';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';


const Register = () => {

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn])


  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    avtar: '',
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    })
  };

  const fileHandleInput = (e) => {
    let name = e.target.name;
    let value = e.target.files[0];
    setUser({
      ...user,
      [name]: value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log(user);
      // return false;
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("mobile", user.mobile);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("avtar", user.avtar);

      const response = await fetch("http://localhost:5000/api/register-user", {
        method: 'POST',
        headers: {
          // "Content-Type": "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        const completeRes = await response.json();
        setUser({
          name: "",
          mobile: "",
          email: "",
          password: "",
          avtar: '',
        })
        toast.success(
          completeRes.message
        );
        navigate('/login');
      } else {
        const errorResponse = await response.json();
        toast.error(
          errorResponse.message ||
          "Register failed. Invalid credentials or server error."
        );
      }

    } catch (error) {
      console.log("Error in Register Page", error);
      toast.error("An unexpected error occurred.");
    }

  };



  return (
    <>

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

              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">registration form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="username">username</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInput}
                      placeholder="name"
                      required
                    />
                  </div>
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
                    <label htmlFor="phone">phone</label>
                    <input
                      type="number"
                      name="mobile"
                      value={user.mobile}
                      onChange={handleInput}
                      placeholder="Number"
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
                  <div>
                    <label htmlFor="avtar">Avtar</label>
                    <input
                      type="file"
                      name="avtar"
                      onChange={fileHandleInput}
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit">
                    {/* <LoadingButton
                      size="large"
                      onClick={handleClick}
                      loading={loading}
                      color="secondary"
                      variant="outlined"
                      disabled
                    >
                  </LoadingButton> */}
                    <span>Register Now</span>

                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
export default Register;
