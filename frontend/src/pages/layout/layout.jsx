import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.scss";

const Layout = () => {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default Layout;
