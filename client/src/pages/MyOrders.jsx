import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../store/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const MyOrders = () => {

    const { token, cartCount } = useContext(AuthContext);
    const [orderDetail, setOrderDetail] = useState([]);
    orderDetail.reverse()

    const fetchOrderDetails = async () => {
        try {

            const response = await fetch("http://localhost:5000/api/view-order", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                const completeData = completeRes.data;
                setOrderDetail(completeData);
            } else {
                const errorResponse = await response.json();
                console.log("Error on My Orders Page :", errorResponse.message);
            }

        } catch (error) {
            console.log("Error on My Orders Page :", error);
        }
    };

    const deleteOrder = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/api//delete-order?_id=${_id}`, {
                        method: "GET",
                        headers: {
                            "Authorization": token,
                        },
                    });

                    if (response.ok) {
                        const completeRes = await response.json();
                        Swal.fire({
                            title: "Deleted!",
                            text: completeRes.message,
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchOrderDetails();
                    } else {
                        const errorResponse = await response.json();
                        Swal.fire({
                            title: "Deleted!",
                            text: errorResponse.message,
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } catch (error) {
                    console.log("Error on delete Product function:", error);
                    Swal.fire({
                        title: "Deleted!",
                        text: error,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

            }
        });
    };

    useEffect(() => {
        fetchOrderDetails();
        cartCount();
    }, []);

    return (
        <>
            <section className='section1'>
                <h1 className='order'>My Orders</h1>
                {orderDetail && orderDetail.map((curOrder, i) => (
                    <div key={i} className="container1">
                        <div className="row">
                            <div className="colum">
                                <div className="card-stepper" >
                                    <div className="card-header">
                                        <div className=" details">
                                            <div>
                                                <p className="text-muted "> Order ID : <span className="fw-bold text-body">{curOrder.orderNumber}</span></p>
                                                <p className="text-muted "> Ordered On : <span className="fw-bold text-body">{new Date(curOrder.createdAt).toLocaleString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }
                                                )}</span> </p>

                                            </div>
                                            <h2 className='viewDetail'>View Details</h2>
                                            <div>
                                                {(curOrder.orderStatus === 'Delivered') ? false : <DeleteIcon className='delete-icon' onClick={() => deleteOrder(curOrder._id)} />}
                                            </div>
                                        </div>
                                        <hr />
                                    </div>

                                    <div className="card-body">
                                        {curOrder.orderItems.map((curItem, i) => (

                                            <div key={i} className=" img-product">
                                                <div className="flex-fill">
                                                    <p className="bold">Name: {curItem.productName}</p>
                                                    <p className="text-muted"> Qty: {curItem.quantity}</p>
                                                    <p className="mb-3"> &#8377; {curItem.price} <br /> <span className="small text-muted"> via ({curOrder.paymentMode}) </span></p>
                                                </div>
                                                <div>
                                                    <img className=" img-product1"
                                                        src={curItem.productId.image[0]} width="80" />
                                                </div>
                                            </div>

                                        ))
                                        }
                                        < hr />
                                        <ul id="progressbar-1" >
                                            <li className={(curOrder.orderStatus == "Pending" || curOrder.orderStatus == "Processing" || curOrder.orderStatus == "Shipped" || curOrder.orderStatus == "Delivered") ? "step0 active" : ""} id="step1"><span
                                            >PENDING</span></li>
                                            <li className={(curOrder.orderStatus == "Processing" || curOrder.orderStatus == "Shipped" || curOrder.orderStatus == "Delivered") ? "step0 active" : ""} id="step2"><span
                                            >PROCESSING</span></li>
                                            <li className={(curOrder.orderStatus == "Shipped" || curOrder.orderStatus == "Delivered") ? "step0 active" : ""} id="step3"><span>SHIPPED</span></li>
                                            <li className={(curOrder.orderStatus == "Delivered") ? "step0 active" : ""} id="step4"><span
                                            >DELIVERED</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                }
            </section>
        </>
    )
}

export default MyOrders