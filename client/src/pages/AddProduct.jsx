import React from "react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filesImage, setfilesImage] = useState([])
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        companyId: "",
    });

    // lets tackle our handleInput
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

    // const selectFiles = (event) => {
    //     let image = [];
    //     for (let i = 0; i < event.target.files.length; i++) {
    //         image.push(event.target.files[i]);
    //     }

    //     setProduct({ ...product, image });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("description", product.description);
            formData.append("categoryId", product.categoryId);
            formData.append("companyId", product.companyId);
            filesImage.forEach(element => {
                formData.append("image", element);
            });


            const response = await fetch("http://localhost:5000/api/create-product", {
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
                    description: "",
                    categoryId: "",
                    companyId: ""
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
            console.log("error in AddProduct page", error);
            toast.error("An unexpected error occurred.");
        }

    };

    useEffect(() => {

        const fetchCategory = async () => {
            try {

                const response = await fetch("http://localhost:5000/api/view-category", {
                    method: "GET",
                });

                if (response.ok) {
                    const completeRes = await response.json();
                    const completeData = completeRes.data;
                    setCategories(completeData);
                } else {
                    const errorResponse = await response.json();
                    console.log("Error on add product Page:", errorResponse.message);
                }

            } catch (error) {
                console.log("Error on add product Page:", error);
            }
        };

        const fetchCompany = async () => {
            try {

                const response = await fetch("http://localhost:5000/api/view-company", {
                    method: "GET",
                    headers: {
                        // "Authorization": token,
                    },
                });

                if (response.ok) {
                    const completeRes = await response.json();
                    const completeData = completeRes.data;
                    setCompanies(completeData);
                } else {
                    const errorResponse = await response.json();
                    console.log("Error on add product page:", errorResponse.message);
                }

            } catch (error) {
                console.log("Error on add product page:", error);
            }
        };

        fetchCompany();
        fetchCategory();
    }, []);


    return (
        <>
            <section className="section-contact">
                <div className="contact-content container">
                    <h1 className="main-heading">Add Product</h1>
                </div>
                {/* contact page main  */}
                <div className="container grid grid-two-cols">
                    <div className="contact-img">
                        <img src="/images/support.png" alt="we are always ready to help" />
                    </div>

                    {/* contact form content actual  */}
                    <section className="section-form">
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
                                    placeholder="Name"
                                    required
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
                                    placeholder="Price"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={fileHandleMultiple}
                                    required
                                    multiple
                                />
                            </div>
                            <div className="select">
                                <div className="select-box">
                                    <label htmlFor="category">Category</label>
                                    <select name="categoryId" id="categoryId" required onChange={handleInput}>

                                        <option key={categories.length + 1} value="">Select Category</option>
                                        {categories &&
                                            categories.map((curCat) =>
                                                (<option key={curCat._id} value={curCat._id}>{curCat.name}</option>)
                                            )
                                        }
                                    </select>
                                </div>

                                <div className="select-box">
                                    <label htmlFor="company">Company</label>
                                    <select name="companyId" id="companyId" required onChange={handleInput}>
                                        <option key='sdfsdfsdf' value="">Select Company</option>
                                        {companies &&
                                            companies.map(
                                                (curComp) => (<option key={curComp._id} value={curComp._id}>{curComp.name}</option>)
                                            )
                                        }

                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    autoComplete="off"
                                    value={product.description}
                                    onChange={handleInput}
                                    placeholder="description write here..."
                                    required
                                    cols="30"
                                    rows="6"
                                ></textarea>
                            </div>


                            <div>
                                <button type="submit">Add Product</button>
                            </div>
                        </form>
                    </section>
                </div>
            </section>
        </>
    )
}

export default AddProduct