import React from 'react';
import { NavLink } from 'react-router-dom';
import { RxCrossCircled } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../store/auth";

const PaymentCancel = () => {
    const { token } = useContext(AuthContext);
    const { id } = useParams();

    const deleteOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/delete-order?_id=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                console.log(completeRes);
            } else {
                const errorResponse = await response.json();
                console.log(errorResponse);
            }
        } catch (error) {
            console.log("Error on delete order function:", error);
        }
    };
    deleteOrder();


    return (
        <>
            <div className="text-center">
                <RxCrossCircled className='svg-icon1' />
            </div>
            <div className="text-center">
                <p className='payment1'> Payment Failed </p>
                <h1>Sorry !</h1>
                <h1>&#128542;</h1>
                <NavLink to="/"> <button className='cancel'>Return Home</button></NavLink>
            </div>
        </>
    )
}

export default PaymentCancel