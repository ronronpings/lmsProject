import React from "react";
import { Layout } from "../common/Layout";
import { Hero } from "../common/Hero"
import { FeaturedCategories } from "../common/FeaturedCategories"

export const Home = () => {
  return (
    <>
      <Layout>
          <Hero/>
          <FeaturedCategories/>
      </Layout>
    </>
  );
};
