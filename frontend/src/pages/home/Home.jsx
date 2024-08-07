import "./Home.scss";
import React, { Fragment } from "react";
import BlogSearch from "../../components/blogSearch/BlogSearch";
import { NavLink } from "react-router-dom";
import UsersFront from "../../components/Users/Users";

const Home = () => {
  return (
    <Fragment>
      <div className="container df">
        <NavLink to={"/profile"}>Profile</NavLink>
        <BlogSearch />
      </div>
      <UsersFront />
    </Fragment>
  );
};

export default Home;
