import React, { useState, useEffect, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../store/auth';
import Swal from 'sweetalert2';
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";

const CartItem = () => {

    const { token, API_BASE_URL, addToCart, cartCount, cartItemCounts } = useContext(AuthContext);
    const [cartItemDetail, setCartItemDetail] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const increaseCartItem = async (productId) => {
        const response = await addToCart({
            "quantity": 1,
            "productId": productId
        });
        fetchCartItems();
        if (response.ok) {
            const completeRes = await response.json();
        } else {
            const errorResponse = await response.json();
        }
    };

    const decreaseCartItem = async (_id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/decrease-cart-item?_id=${_id}`, {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            });
            fetchCartItems()
            if (response.ok) {
                const completeRes = await response.json();
                cartCount();
            } else {
                const errorResponse = await response.json();
            }
        } catch (error) {
            console.log("Error on decreaseCartItem function", error);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await fetch(API_BASE_URL + "/get-cart-item-details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });
            if (response.ok) {
                const completeRes = await response.json();
                const cartData = completeRes.data;
                // console.log(cartData[1].grandTotal);
                setGrandTotal(cartData[1].grandTotal);
                setCartItemDetail(cartData);
            } else {
                const errorResponse = await response.json();
            }
        } catch (error) {
            console.log("Error on fetchCartItems function", error);
        }
    };

    const deleteCartItem = (_id) => {
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
                    const response = await fetch(`http://localhost:5000/api/delete-cart-item?_id=${_id}`, {
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
                        fetchCartItems();
                        cartCount();

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
                    console.log("Error on deleteCartItem function:", error);
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
        fetchCartItems();
    }, [])
    // console.log(cartItemDetail[1].grandTotal);

    return (
        <>
            {(cartItemCounts >= 1) ?
                <table className='table cart-table mb-0 table-responsive-sm'>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Product</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th className='text-right'> <span id="amount" className='amount'>Total Amount</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cartItemDetail[0] &&
                            cartItemDetail[0]['cartitem'].map((eachElement, index) => {
                                const { productId, _id } = eachElement;
                                return (

                                    <tr key={index}>
                                        <td >
                                            <button className='prdct-delete'
                                                onClick={() => deleteCartItem(eachElement._id)}
                                            ><DeleteIcon /> </button>
                                        </td>
                                        <td><div className='product-img'><img src={eachElement.productImage} alt="" /></div></td>
                                        <td><div className='product-name'><p>{eachElement.productName}</p></div></td>
                                        <td>&#8377;{eachElement.productPrice}</td>
                                        <td>
                                            <div className="prdct-qty-container">
                                                <button className='prdct-qty-btn' type='button'
                                                    onClick={() => { decreaseCartItem(_id) }}
                                                >
                                                    <CiCircleMinus />
                                                </button>
                                                <input type="text" className='qty-input-box' value={eachElement.quantity} disabled name="" id="" />
                                                <button className='prdct-qty-btn' type='button' onClick={() => { increaseCartItem(productId) }}>
                                                    <CiCirclePlus />
                                                </button>
                                            </div>
                                        </td>
                                        <td className='text-right'>&#8377;{eachElement.quantity * eachElement.productPrice}</td>
                                    </tr>

                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>&nbsp;</th>
                            <th colSpan={2}>&nbsp;</th>
                            <th className='text-right2'>Items In Cart <span className='ml-2 mr-2'> : </span><span className='text-left'>{(cartItemCounts > 0) ? cartItemCounts : null}</span></th>
                            <th className='text-right2'>Total Price<span className='ml-2 mr-2'> : </span><span className='text-left'>&#8377;{grandTotal && grandTotal}</span></th>
                            <th >
                                <NavLink to="/checkout"><button className='btn btn-success' type='button' disabled={(cartItemCounts > 0) ? false : true}>Checkout</button></NavLink>
                            </th>
                        </tr>
                    </tfoot>
                </table>
                : <div className='emptyCart'>
                    <BsCartPlus className='emptyCartIcon' />
                    <h1>Empty Cart</h1>
                    <p>For Order Something Please Add Product to Cart</p>
                </div>
            }

        </>
    )
}

export default CartItem