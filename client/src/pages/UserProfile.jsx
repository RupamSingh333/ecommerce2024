import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/auth";
import { Link } from "react-router-dom";


const UserProfile = () => {

    const { isLoggedIn, authData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [contact, setContact] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "",
        avtar: ""
    });

    useEffect(() => {
        setContact({ ...authData })
    }, [authData])


    return (
        <>
            <div className="user-profile">
                <div className="profile">
                    <div className="profile-data">
                        <div className="profile-img">
                            <img src={contact.avtar} alt="user-image" />
                        </div>
                        <div className="user-name">{contact.name}</div>
                        <div className="user-email">{contact.email}</div>
                    </div>
                    <div className="profile-data">
                        <span>Details</span>
                        <div className="user-details">
                            <ol className="data-a">
                                <li>Name</li>
                                <li>Email</li>
                                <li>Mobile</li>
                                <li>Role</li>
                            </ol>
                            <ol className="data-b">
                                <li>{contact.name}</li>
                                <li>{contact.email}</li>
                                <li>{contact.mobile}</li>
                                <li>{contact.role}</li>
                            </ol>
                        </div>
                        <Link className="update" to="/update-profile">Update Profile</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile