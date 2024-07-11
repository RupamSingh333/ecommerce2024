import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../store/auth';
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { RotatingLines } from 'react-loader-spinner';
import Pagination from '../components/Pagination';

const ContactList = () => {
    const { token } = useContext(AuthContext);

    const [contactData, setContactData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = contactData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const deleteContact = async (_id) => {
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
                    const response = await fetch(`http://localhost:5000/api/delete-contact?_id=${_id}`, {
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

                        // Update contactData state after successful deletion
                        setContactData(prevData => prevData.filter(contact => contact._id !== _id));

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

    const fetchUserDetails = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/view-all-contact", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });
            if (response.ok) {
                const completeRes = await response.json();
                const completeData = completeRes.data;
                setContactData(completeData);
            } else {
                const errorResponse = await response.json();
                console.log("Error fetching contacts:", errorResponse.message);
                Swal.fire({
                    title: "Error!",
                    text: errorResponse.message || "Failed to fetch contacts",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.log("Error on Contact Page:", error);
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to fetch contacts",
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [token]); // Fetch contacts whenever token changes

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
                    wrapperStyle={{ margin: 'auto' }}
                    wrapperClass=""
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Reason</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentItems.map((currentContact, i) => {
                            const { _id, name, email, mobile, reason } = currentContact;
                            return (
                                <tr key={i}>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{mobile}</td>
                                    <td>{reason}</td>
                                    <td><DeleteIcon className='delete-icon' onClick={() => deleteContact(_id)} /></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={contactData.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default ContactList;
