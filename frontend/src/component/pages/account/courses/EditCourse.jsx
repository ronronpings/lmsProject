import React, { useEffect, useState } from "react";
import { Layout } from "../../../common/Layout";
import { UserSidebar } from "../../../common/UserSidebar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

export const EditCourse = () =>{
    const {
        handleSubmit, register, formState: {errors}, setError
    } = useForm();
    const navigate = useNavigate();  
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);


    const onSubmit = async (data) => {
     console.log(data);
     try {
      const res = await fetch(`${apiUrl}courses`, {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          //add token for the authorization
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        // Laravel validation errors example: { errors: { email: ["..."] } }
        if (result?.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, {
              type: "server",
              message: result.errors[field][0],
            });
          });
        }
        //appear toast if invalid credentials comes from backend
        toast.error(result.message);
        return; // stop, do not navigate
      }
      toast.success("Created Successfully");
      navigate('/account/courses/edit/' + result.data.id);
    } catch (error) {
    console.log(error);
    }
    }

    //Retrive Data from backend api 
    const retriveData = async () => {
         try {
      const res = await fetch(`${apiUrl}courses/meta-data`, {
        
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          //add token for the authorization
          'Authorization' : `Bearer ${token}`
        },
      });

      const result = await res.json();
      if (!res.ok) {
        // Laravel validation errors example: { errors: { email: ["..."] } }
        if (result?.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, {
              type: "server",
              message: result.errors[field][0],
            });
          });
        }
        //appear toast if invalid credentials comes from backend
        toast.error(result.message);
        return; // stop, do not navigate
      }
      setCategories(result.categories)
      setLevels(result.levels)
      setLanguages(result.languages)
      

    } catch (error) {
    console.log(error);
    }
    }
    useEffect(() => {
        retriveData();
    }, [])
    return(
        <Layout>
             <section className='section-4'>
             <div className='container pb-5 pt-3'>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><Link to="/account">Account</Link></li>
						<li className="breadcrumb-item active" aria-current="page">Dashboard</li>
					</ol>
				</nav>
                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar/>
                    </div>
                    <div className='col-lg-9'>
                        <div className='row'>
                            <div className="col-md-7">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body p-4">
                                            <h4 className="h5 border-bottom pb-3 mb-3">Course Details</h4>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="title">Title</label>
                                                <input
                                                {
                                                    ...register('title', {
                                                    required: "The title field is required"
                                                    })
                                                }

                                                type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`}placeholder="Title" />
                                                {
                                                errors.title && <p className="invalid-feedback">{errors.title.message}</p> 
                                                }
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="category">Category</label>
                                                <select className="form-select" id="category">
                                                    <option>Select Category</option>
                                                    {categories?.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                    ))}

                                                </select>
                                            </div>
                                             <div className="mb-3">
                                                <label className="form-label" htmlFor="level">Level</label>
                                                <select className="form-select" id="level">
                                                    <option>Select Level</option>
                                                    {levels?.map((level) => (
                                                    <option key={level.id} value={level.id}>
                                                        {level.name}
                                                    </option>
                                                    ))}

                                                </select>
                                            </div>
                                             <div className="mb-3">
                                                <label className="form-label" htmlFor="language">Language</label>
                                                <select className="form-select" id="level">
                                                    <option>Select Language</option>
                                                    {languages?.map((language) => (
                                                    <option key={language.id} value={language.id}>
                                                        {language.name}
                                                    </option>
                                                    ))}

                                                </select>
                                            </div>
                                             <div className="mb-3">
                                                <label className="form-label" htmlFor="description">Description</label>
                                                <textarea id="description" rows={5} placeholder="Description"className="form-control"></textarea>
                                            </div>

                                            <h4 className="h5 border-bottom pb-3 mb-3">Price</h4>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="cross-price">Sell Price</label>
                                                <input
                                                {
                                                    ...register('title', {
                                                    required: "The title field is required"
                                                    })
                                                }

                                                type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`}placeholder=" Sell Price" id="sell-price" />
                                                {
                                                errors.title && <p className="invalid-feedback">{errors.title.message}</p> 
                                                }
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="cross-price">Cross Price</label>
                                                <input
                                                {
                                                    ...register('title', {
                                                    required: "The title field is required"
                                                    })
                                                }

                                                type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`}placeholder=" Cross Price" id="cross-price" />
                                                {
                                                errors.title && <p className="invalid-feedback">{errors.title.message}</p> 
                                                }
                                            </div>

                                            <button className="btn btn-primary">Update</button>
                                        </div>
                                    </div>
                            </form>
                            </div>
                            <div className="col-md-5">
                                 
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
        </Layout>
    )
}
