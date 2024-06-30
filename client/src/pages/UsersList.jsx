import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../store/auth';
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";
import { RotatingLines } from 'react-loader-spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import Pagination from '../components/Pagination';

const UsersList = () => {

    const { token } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const deleteUser = (_id) => {
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
                    const response = await fetch(`http://localhost:5000/api/delete-user?_id=${_id}`, {
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
                    console.log("Error on delete user function:", error);
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

    const changeStatus = async (_id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/change-status?_id=${_id}`, {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                setLoading(false);
                toast.success(
                    completeRes.message
                );


            } else {
                setLoading(false);
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
    const fetchUserDetails = async () => {
        try {

            const response = await fetch("http://localhost:5000/api/view-all-user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const completeRes = await response.json();
                const completeData = completeRes.data;
                setUserData(completeData);
                setLoading(false);
            } else {
                const errorResponse = await response.json();
                console.log("Error on Contact Page:", errorResponse.message);
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.log("Error on Contact Page:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchUserDetails();
        }, 500);
    }, [token]);


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
                        <th>Avtar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentItems.map((curUser, i) => {
                            const { _id, name, email, role, mobile, status, avtar } = curUser;
                            return (
                                <tr key={i}>
                                    <td className="user-img"><img src={avtar} alt="user-image" /></td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{mobile}</td>
                                    <td>{role}</td>
                                    <td>
                                        <Switch
                                            checked={status === 'Y'}
                                            onClick={() => changeStatus(_id)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </td>
                                    <td>
                                        <DeleteIcon className='delete-icon' onClick={() => deleteUser(_id)} />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={userData.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default UsersList