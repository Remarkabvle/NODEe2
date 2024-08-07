import "./Login.scss";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setToken } from "../../context/slices/authSlice";
import { useLoginUserMutation } from "../../context/api/userApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginUser, { data, isSuccess }] = useLoginUserMutation();
  const [state, setState] = useState({ username: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginUser(state);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.msg);
      dispatch(setToken(data?.token));
      navigate("/");
    }
  }, [isSuccess]);

  return (
    <Fragment>
      <form className="login-container" onSubmit={handleLogin} action="">
        <h3>Login</h3>
        <div className="login-input">
          <label htmlFor="username">Username</label>
          <input
            value={state.username}
            onChange={(e) =>
              setState({ ...state, [e.target.name]: e.target.value })
            }
            required
            name="username"
            type="text"
            placeholder="Enter username"
          />
        </div>
        <div className="login-input">
          <label htmlFor="password">Password</label>
          <input
            value={state.password}
            onChange={(e) =>
              setState({ ...state, [e.target.name]: e.target.value })
            }
            required
            name="password"
            type="password"
            placeholder="Enter password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </Fragment>
  );
};

export default Login;
