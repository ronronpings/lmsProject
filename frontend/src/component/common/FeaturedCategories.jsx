import React, { useState, useEffect } from 'react';
import { apiUrl } from './Config';
import toast from 'react-hot-toast';

export const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}categories`);
      const data = await response.json();

      if (!response.ok || !data.status) {
        toast.error(data.message);
        return;
      }
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <>
      <section className="section-2">
        <div className="container">
          <div className="section-title py-3  mt-4">
            <h2 className="h3">Explore Categories</h2>
            <p>
              Discover categories designed to help you excel in your
              professional and personal growth.
            </p>
          </div>
          <div className="row gy-3">
            {categories &&
              categories.map((category, index) => (
                <div className="col-6 col-md-6 col-lg-3" key={index}>
                  <div className="card shadow border-0">
                    <div className="card-body">
                      <a href="">{category.name}</a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};
