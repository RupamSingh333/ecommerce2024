import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../store/auth";
import { TbStatusChange } from "react-icons/tb";
import { toast } from "react-toastify";


const AllOrdersList = () => {
    const { token } = useContext(AuthContext);
    const [orderDetail, setOrderDetail] = useState([]);

    const fetchOrderDetails = async () => {
        try {

            const response = await fetch("http://localhost:5000/api/view-all-order", {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                const completeData = completeRes.data;
                setOrderDetail(completeData);
            } else {
                const errorResponse = await response.json();
                console.log("Error on All Orders List Page :", errorResponse.message);
            }

        } catch (error) {
            console.log("Error on All Orders List Page :", error);
        }
    };

    const changeStatus = async (_id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/change-order-status?_id=${_id}`, {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                toast.success(
                    completeRes.message
                );


            } else {
                const errorResponse = await response.json();
                toast.error(
                    errorResponse.message
                );
            }
        } catch (error) {
            console.log("Error on changeStatus function:", error);
            toast.error("An unexpected error occurred.");
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Order Number</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Payment Mode</th>
                        <th>Status</th>
                        <th>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetail && orderDetail.map((curOrder, i) => (
                            <tr key={i} className='orderList'>
                                <td>{curOrder.orderNumber}</td>
                                <td>{curOrder.customerName}</td>
                                <td>{curOrder.totalAmount}</td>
                                <td>{curOrder.paymentMode}</td>
                                <td>{curOrder.orderStatus}</td>
                                <td><TbStatusChange className='statusChange' onClick={(curOrder.orderStatus === "Delivered") ? false : () => changeStatus(curOrder._id)} /></td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}

export default AllOrdersList