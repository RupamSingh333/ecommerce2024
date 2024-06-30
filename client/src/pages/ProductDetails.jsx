import React, { useState, useEffect, useContext } from 'react';
import { FaCartShopping } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { RotatingLines } from 'react-loader-spinner';
import { AuthContext } from '../store/auth';
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const ProductDetails = () => {
    const { addToCart } = useContext(AuthContext);
    const { id } = useParams();
    const [singleProduct, setSingleProduct] = useState();
    const [quantity, setQuantity] = useState(1)

    const getProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/view-product?_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                const productData = completeRes.data;
                // console.log(productData);
                // return false;
                setSingleProduct(productData);
            } else {
                const errorResponse = await response.json();
            }
        } catch (error) {
            console.log("Error on delete user function:", error);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            getProduct();
        }, 500);
    }, [id]);

    const handleCart = async () => {
        const response = await addToCart({
            "quantity": quantity,
            "productId": id
        });

        if (response.ok) {
            const completeRes = await response.json();
            // toast.success(
            //     completeRes.message
            // );
        } else {
            const errorResponse = await response.json();
            // toast.error(
            //     errorResponse.message
            // );
        }
        // console.log(response);
        // return false;
    }

    {/* <div className="single-products">

    <div className="loader">
        <RotatingLines
            visible={loading}
            height="60"
            width="60"
            color="grey"
            strokeWidth="3"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    </div>
    {singleProduct && <div className="single-product">
        <div className="single-product-img">
            <img src={singleProduct.image[0]} alt="Product Image" />

        </div>
        <div className="single-product-details">
            <div className="single-product-name">{singleProduct.name}</div>
            <div className="single-product-price">&#8377; {singleProduct.price}</div>
            <div className="product-category">Category : {singleProduct.categoryId.name}</div>
            <div className="product-company">Company : {singleProduct.companyId.name}</div>
            <div className="single-product-description">{singleProduct.description}</div>
            <button><FaCartShopping />Add To Cart</button>
        </div>
    </div>}
</div> */}
    return (
        <>
            {!singleProduct && <div className="loader">
                <RotatingLines
                    visible={true}
                    height="60"
                    width="60"
                    color="grey"
                    strokeWidth="3"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>}

            {singleProduct && <section className="product-container">
                <div className="img-card">
                    <img className="big-img" src={singleProduct.image[0]} alt="" id="featured-image" />
                    <div className="small-Card">
                        {singleProduct.image.map((curImg, i) => (
                            <img key={i} src={curImg} alt="product img" className="small-Img" />
                        ))
                        }
                    </div>
                </div>

                <div className="product-info">
                    <h3>{singleProduct.name}</h3>
                    <h5>{singleProduct.price}<del>$170</del></h5>
                    <p>{singleProduct.description}</p>

                    {/* <div className="sizes">
                        <p>Size:</p>
                        <select name="Size" id="size" className="size-option">
                            <option value="xxl">XXL</option>
                            <option value="xl">XL</option>
                            <option value="medium">Medium</option>
                            <option value="small">Small</option>
                        </select>
                    </div> */}

                    <div className="quantity">
                        <input type="number" name='quantity' onChange={e => setQuantity(e.target.value)} value={quantity} min="1" />
                        <button onClick={handleCart}>Add to Cart</button>
                    </div>

                </div>
            </section>}
        </>
    )
}

export default ProductDetails;