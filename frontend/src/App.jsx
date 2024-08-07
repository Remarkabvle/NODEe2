import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";

import Auth from "./pages/auth/Auth";
import Begin from "./pages/Begin/Begin";
import { Fragment } from "react";
import Home from "./pages/home/Home";
import Layout from "./pages/layout/layout";
import Login from "./pages/login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/register/Register";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Begin />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Auth />}>
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
