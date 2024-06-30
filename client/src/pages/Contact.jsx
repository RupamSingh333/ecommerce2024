import React from "react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../store/auth"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Contact = () => {
  const { authData, token } = useContext(AuthContext);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    mobile: "",
    reason: ""
  });

  useEffect(() => {
    setContact({ ...authData })
  }, [authData])


  // lets tackle our handleInput
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setContact({
      ...contact,
      [name]: value,
    });
  };


  // handle fomr getFormSubmissionInfo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        const completeRes = await response.json();
        toast.success(
          completeRes.message
        );
        if (token) {
          setContact({
            ...contact,
            reason: "",
          });
        } else {
          setContact({
            name: "",
            email: "",
            mobile: "",
            reason: ""
          });
        }
      } else {
        const errorResponse = await response.json();
        toast.error(
          errorResponse.message
        );
      }
    } catch (error) {
      console.log("Error on contact Page:", error);
      toast.error("An unexpected error occurred.");
    }

    // console.log(contact);
  };

  return (
    <>
      <section className="section-contact">
        <div className="contact-content container">
          <h1 className="main-heading">Contact Us</h1>
        </div>
        {/* contact page main  */}
        <div className="container grid grid-two-cols">
          <div className="contact-img">
            <img src="/images/support.png" alt="we are always ready to help" />
          </div>

          {/* contact form content actual  */}
          <section className="section-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  value={contact.name}
                  onChange={handleInput}
                  placeholder="Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email">email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  value={contact.email}
                  onChange={handleInput}
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <label htmlFor="email">mobile</label>
                <input
                  type="number"
                  name="mobile"
                  id="mobile"
                  autoComplete="off"
                  value={contact.mobile}
                  onChange={handleInput}
                  placeholder="+91 7688XXXXXX"
                  required
                />
              </div>

              <div>
                <label htmlFor="message">message</label>
                <textarea
                  name="reason"
                  id="reason"
                  autoComplete="off"
                  value={contact.reason}
                  onChange={handleInput}
                  placeholder="Message write here..."
                  required
                  cols="30"
                  rows="6"
                ></textarea>
              </div>
              <div>
                <button type="submit">submit</button>
              </div>
            </form>
          </section>
        </div>

        <section className="mb-3">


          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.757969317278!2d75.76627951115248!3d26.847649362786154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5dc708acf6d%3A0x539c5582951a6645!2sDAAC%20-%20Training%20and%20Development%20Course%20%7C%20Industrial%20Training%20%7C%20Programming%20training!5e0!3m2!1sen!2sin!4v1702324725001!5m2!1sen!2sin"
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </section>
    </>
  );
};
export default Contact;
