import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../store/auth';
import { NavLink } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";


const PaymentSuccess = () => {

    const { clearCart } = useContext(AuthContext);

    useEffect(() => {
        clearCart();
    }, []);


    return (
        < >
            <div className="text-center">
                <IoMdCheckmarkCircleOutline className='svg-icon' />
            </div>
            <div className="text-center">
                <p className='payment'>Payment Done </p>
                <h1>Thank You !</h1>
                <h1>&#128516;</h1>
                <NavLink to="/"> <button className="cancel">Return Home</button></NavLink>
            </div>
        </>
    )
}

export default PaymentSuccess