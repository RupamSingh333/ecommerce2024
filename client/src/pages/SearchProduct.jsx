import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from '../components/Pagination';

const SearchProduct = () => {

    const [productData, setProductData] = useState([]);
    const navigate = useNavigate();

    const productDetail = (_id) => {
        navigate(`/product-details/${_id}`)
    }

    // Pagination state
    // const itemsPerPage = 5;
    // const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of items to display on the current page
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    const searchProduct = async (e) => {
        let value = e.target.value;
        try {

            const response = await fetch(`http://localhost:5000/api/search-product?name=${value}`, {
                method: "GET",
                headers: {
                    // "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const completeRes = await response.json();
                const completeData = completeRes.data;
                setProductData(completeData);
            } else {
                const errorResponse = await response.json();
                console.log("Error on ProductList Page:", errorResponse.message);
            }

        } catch (error) {
            console.log("Error on ProductList Page:", error);
        }
    };

    return (
        <>
            <div className="search-product">
                <div className="search-input">
                    <form >
                        <input
                            type="text"
                            placeholder="Product Search Here......"
                            name='search'
                            onChange={searchProduct}
                        />
                    </form>
                </div>
                <div className="searched-products">
                    {productData && productData.map((curProd, i) => (
                        <div className="searched-product" key={i} onClick={() => productDetail(curProd._id)}>
                            <div className="searched-product-img">
                                <img src={curProd.image[0]} alt="" />
                            </div>
                            <div className="searched-product-details">
                                <div className="product-name">{curProd.name}</div>
                                <div className="product-price">&#8377; {curProd.price}</div>
                                <div className="product-company">{curProd.companyId.name}</div>
                                <div className="product-description">{curProd.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={productData.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            /> */}
        </>
    )
}

export default SearchProduct