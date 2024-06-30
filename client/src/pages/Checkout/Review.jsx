import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { AuthContext } from '../../store/auth';
import { loadStripe } from '@stripe/stripe-js';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const products = [
    {
        name: 'Product 1',
        desc: 'A nice thing',
        price: '$9.99',
    },
    {
        name: 'Product 2',
        desc: 'Another thing',
        price: '$3.45',
    },
    {
        name: 'Product 3',
        desc: 'Something else',
        price: '$6.51',
    },
    {
        name: 'Product 4',
        desc: 'Best thing of all',
        price: '$14.11',
    },
    { name: 'Shipping', desc: '', price: 'Free' },
];

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
    { name: 'Card type', detail: 'Visa' },
    { name: 'Card holder', detail: 'Mr John Smith' },
    { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
    { name: 'Expiry date', detail: '04/2024' },
];

export default function Review(props) {
    const { token, API_BASE_URL, clearCart, cartCount } = useContext(AuthContext);

    const { completeAddress } = props;
    const [cartItemDetail, setCartItemDetail] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const fetchCartItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/get-cart-item-details", {
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
                setCartItemDetail(cartData[0].cartitem);
            } else {
                const errorResponse = await response.json();
            }
        } catch (error) {
            console.log("Error on fetchCartItems function", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
        cartCount();
    }, []);


    const navigate = useNavigate();
    const makePayment = async () => {
        Swal.fire({
            title: "Choose Payment Method",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Online",
            denyButtonText: `Cash On Delivery`
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                const stripe = await loadStripe("pk_test_51OGy4BSEWW2cslHi0f17aZrw80XjrGri3c1xrmRkBuObWYSk5DmKU86w3pH5aN0BOXDUxx180N70ZiDQ3b7B0jmq00fuJJQGlF");

                const cItemsArr = cartItemDetail.map((item) => {
                    // console.log(item.productId.name);
                    const itmeObj = {
                        "productId": item.productId._id,
                        "productName": item.productId.name,
                        "quantity": item.quantity,
                        "price": item.productPrice
                    }
                    return itmeObj;
                });

                const body = {
                    "totalAmount": grandTotal,
                    "orderItems": cItemsArr,
                    "paymentMode": "Online",
                    "deliveryDetails": completeAddress
                };

                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": token,
                };

                try {
                    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(body)
                    });

                    const session = await response.json();
                    const result = await stripe.redirectToCheckout({
                        sessionId: session.id
                    });

                    // Check if the payment was successful
                    if (result.error) {
                        console.log("Error during payment:", result.error);
                    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                        console.log("Payment succeeded!");
                    } else {
                        console.log("Payment not completed or failed.");
                    }
                } catch (error) {
                    console.error("Error making payment:", error);
                }
                Swal.fire("Ordered Success!", "", "success");
            } else if (result.isDenied) {
                const cItemsArr = cartItemDetail.map((item) => {
                    // console.log(item.productId.name);
                    const itmeObj = {
                        "productId": item.productId._id,
                        "productName": item.productId.name,
                        "quantity": item.quantity,
                        "price": item.productPrice
                    }
                    return itmeObj;
                });

                const body = {
                    "totalAmount": grandTotal,
                    "orderItems": cItemsArr,
                    "paymentMode": "Cash On Delivery",
                    "deliveryDetails": completeAddress
                };

                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": token,
                };

                try {
                    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(body)
                    });

                    if (response.ok) {
                        const completeRes = await response.json();

                    } else {
                        const errorResponse = await response.json();

                    }
                } catch (error) {
                    console.error("Error in Cash on delivery function", error);
                }
                navigate("/my-orders")
                clearCart();
                cartCount();
                Swal.fire("Ordered Success!", "", "success");
            }
        });
    };



    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom>
                Order summary
            </Typography>
            <List disablePadding sx={{ flexDirection: "column", width: "80%", margin: "auto" }}>
                {cartItemDetail.map((product, i) => (
                    <ListItem key={i} sx={{ py: 1, px: 0 }}>
                        <img className='order-product-img' src={product.productImage} alt="" />
                        <ListItemText primary={product.productName} secondary={"Quantity  --  " + product.quantity} />
                        <Typography variant="body2">&#8377;{product.productPrice * product.quantity}</Typography>
                    </ListItem>
                ))}

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        &#8377; {grandTotal}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                        Shipping Address
                    </Typography>
                    <Typography>{completeAddress.address} , </Typography>
                    <Typography>{completeAddress.city},{completeAddress.state}</Typography>
                    <Typography>{completeAddress.postalCode}</Typography>
                </Grid>
                {/* <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Payment details
                    </Typography>
                    <Grid container>
                        {payments.map((payment) => (
                            <React.Fragment key={payment.name}>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{payment.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{payment.detail}</Typography>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Grid> */}
                <Grid item xs={12}>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, ml: 1 }}
                            onClick={makePayment}
                        >Proceed Pay
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment >
    );
}