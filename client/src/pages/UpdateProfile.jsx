import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/auth";
import { toast } from "react-toastify";

const UpdateProfile = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        mobile: "",
        avtar: null,
    });

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        let name = e.target.name;
        let value = e.target.files[0];

        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("mobile", user.mobile);
            formData.append("avtar", user.avtar);

            const response = await fetch("http://localhost:5000/api/update-profile", {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (response.ok) {
                navigate('/user-profile');
                const completeRes = await response.json();
                toast.success(completeRes.message);
                // Redirect or handle success
            } else {
                const errorResponse = await response.json();
                toast.error(
                    errorResponse.message ||
                    "Update failed. Invalid credentials or server error."
                );
            }
        } catch (error) {
            console.error("Error in UpdateProfile Page", error);
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <div className="update-profile">
            <div className="update-form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="avtar">Avtar</label>
                        <br />
                        <input
                            type="file"
                            name="avtar"
                            id="avtar"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Name</label>
                        <br />
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInput}
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label htmlFor="phone">Mobile no.</label>
                        <br />
                        <input
                            type="number"
                            name="mobile"
                            value={user.mobile}
                            onChange={handleInput}
                            placeholder=""
                        />
                    </div>

                    <br />
                    <button type="submit" className="btn btn-submit">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;