import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { RotatingLines } from 'react-loader-spinner';
import Pagination from '../components/Pagination';

const Products = () => {
    const [productData, setProductData] = useState([]);
    productData.reverse()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Pagination state
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // console.log(productData);
    const singleProduct = (_id) => {
        navigate(`/product-details/${_id}`)
    }
    const fetchAllProducts = async () => {
        try {

            const response = await fetch("http://localhost:5000/api/view-product", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const completeRes = await response.json();
                const completeData = completeRes.getProduct;
                setProductData(completeData);
                setLoading(false);
            } else {
                const errorResponse = await response.json();
                setLoading(false);
            }
        } catch (error) {
            console.log("Error on Product Page:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchAllProducts();
        }, 500);
    }, []);



    return (
        <>

            <div className="products">
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
                {
                    currentItems.map((currentProduct, i) => {
                        const { _id, name, price, image } = currentProduct;
                        return (
                            <div className="product" key={i} onClick={() => singleProduct(_id)} >
                                <div className="product-img">
                                    <img src={image[0]} alt="product image" />
                                </div>
                                <div className="product-details">
                                    <div className="product-name">{name}</div>
                                    <div className="product-price">&#8377; {price}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={productData.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default Products