import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../store/auth';
import { NavLink } from "react-router-dom";
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";
import { RotatingLines } from 'react-loader-spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import { CiEdit } from "react-icons/ci";
import Swal from 'sweetalert2';
import Pagination from '../components/Pagination';

const ProductList = () => {

    const { token } = useContext(AuthContext);
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const deleteProduct = (_id) => {
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
                    const response = await fetch(`http://localhost:5000/api/delete-product?_id=${_id}`, {
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
    const fetchProductData = async () => {
        try {

            const response = await fetch("http://localhost:5000/api/view-product", {
                method: "GET",
                headers: {
                    // "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const completeRes = await response.json();
                // console.log(completeRes);
                const completeData = completeRes.getProduct;
                setProductData(completeData);
                setLoading(false);
            } else {
                const errorResponse = await response.json();
                console.log("Error on ProductList Page:", errorResponse.message);
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.log("Error on ProductList Page:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchProductData();
        }, 500);
    }, []);

    return (
        <>
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
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Company</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentItems.map((curProd, i) => {
                            const { _id, name, status, image, description, price } = curProd;
                            const category = curProd.categoryId.name;
                            const company = curProd.companyId.name;
                            return (
                                <tr key={i}>
                                    <td className="user-img"><img src={image[0]} alt="product-image" /></td>
                                    <td>{name}</td>
                                    <td>{price}</td>
                                    <td>{category}</td>
                                    <td>{company}</td>
                                    <td>{description}</td>
                                    <td>{status}</td>
                                    <td><NavLink to={`/update-product/${_id}`}>
                                        <CiEdit className='update-icon' />
                                    </NavLink>
                                    </td>
                                    <td>
                                        <DeleteIcon className='delete-icon' onClick={() => deleteProduct(_id)} />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={productData.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default ProductList