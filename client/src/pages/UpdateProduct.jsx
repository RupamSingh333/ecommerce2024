import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../store/auth';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateProduct = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);

    const [productData, setProductData] = useState();
    const [filesImage, setfilesImage] = useState([])


    useEffect(() => {
        const getProductData = async () => {
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
                    setProductData(productData);
                } else {
                    const errorResponse = await response.json();
                }
            } catch (error) {
                console.log("Error on delete user function:", error);
            }
        };

        getProductData();
    }, [productData]);

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: ""
    });
    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setProduct({
            ...product,
            [name]: value,
        });
    };

    let images = [];
    const fileHandleMultiple = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            images.push(e.target.files[i]);
        }
        setfilesImage(images)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("description", product.description);
            formData.append("_id", id),
                filesImage.forEach(element => {
                    formData.append("image", element);
                });

            const response = await fetch("http://localhost:5000/api/update-product", {
                method: 'POST',
                headers: {
                    "Authorization": token,
                },
                body: formData,
            });

            if (response.ok) {
                const completeRes = await response.json();
                // console.log(completeRes);
                // return false;
                setProduct({
                    name: "",
                    price: "",
                    description: ""
                });

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
            console.log("error in Update Product page", error);
            toast.error("An unexpected error occurred.");
        }

    };

    return (
        <>
            <section className="section-contact">
                <div className="contact-content container">
                    <h1 className="main-heading">Update Product</h1>
                </div>
                {/* contact page main  */}
                <div className="container grid grid-two-cols">
                    <div className="contact-img">
                        <img src="/images/support.png" alt="we are always ready to help" />
                    </div>

                    {/* contact form content actual  */}
                    {productData && <section className="section-form">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="off"
                                    value={product.name}
                                    onChange={handleInput}
                                    placeholder={productData.name}
                                />
                            </div>
                            <div>
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    autoComplete="off"
                                    value={product.price}
                                    onChange={handleInput}
                                    placeholder={productData.price}
                                />
                            </div>
                            <div>
                                <label htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={fileHandleMultiple}
                                    multiple
                                />
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    autoComplete="off"
                                    value={product.description}
                                    onChange={handleInput}
                                    placeholder={productData.description}
                                    cols="30"
                                    rows="6"
                                ></textarea>
                            </div>


                            <div>
                                <button type="submit">Update</button>
                            </div>
                        </form>
                    </section>}
                </div>
            </section>
        </>
    )
}

export default UpdateProduct