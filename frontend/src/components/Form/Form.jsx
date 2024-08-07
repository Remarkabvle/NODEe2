import "./Form.scss";
import React, { Fragment, useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "../../context/api/userApi";
import useGetValue from "../../hook/useGetValue";
import { useNavigate } from "react-router-dom";

const initialState = {
  fname: "",
  lname: "",
  username: "",
  password: "",
  age: "",
  url: "",
  gender: "",
  budget: "",
};

const Form = () => {
  const [createUser, { data, isLoading, isSuccess }] = useCreateUserMutation();
  const { handleChange, setUser, user } = useGetValue(initialState);
  const navigate = useNavigate();
  const handleCreateUser = (e) => {
    e.preventDefault();
    createUser(user);
  };
  console.log(data?.msg);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.msg);
      setUser(initialState);
      navigate("/login");
    }
  }, [isSuccess, setUser]);

  return (
    <Fragment>
      <form className="form-container" onSubmit={handleCreateUser} action="">
        <div className="form-input">
          <label htmlFor="fname">Fname</label>
          <input
            required
            value={user.fname}
            onChange={handleChange}
            name="fname"
            type="text"
            placeholder="Enter fname"
          />
        </div>
        <div className="form-input">
          <label htmlFor="lname">Lname</label>
          <input
            required
            value={user.lname}
            onChange={handleChange}
            name="lname"
            type="text"
            placeholder="Enter lname"
          />
        </div>
        <div className="form-input">
          <label htmlFor="username">Username</label>
          <input
            required
            value={user.username}
            onChange={handleChange}
            name="username"
            type="text"
            placeholder="Enter username"
          />
        </div>
        <div className="form-input">
          <label htmlFor="password">Password</label>
          <input
            required
            value={user.password}
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Enter password"
          />
        </div>
        <div className="form-input">
          <label htmlFor="age">Age</label>
          <input
            value={user.age}
            required
            onChange={handleChange}
            name="age"
            type="number"
            placeholder="Enter Age"
          />
        </div>
        <div className="form-input">
          <label htmlFor="url">URL</label>
          <input
            required
            value={user.url}
            onChange={handleChange}
            name="url"
            type="text"
            placeholder="Enter URL"
          />
        </div>
        <div className="form-input">
          <label htmlFor="gender">Gender</label>
          <select
            required
            value={user.gender}
            onChange={handleChange}
            name="gender"
          >
            <option required value="gender">
              Gender
            </option>
            <option required value="male">
              Male
            </option>
            <option required value="female">
              Female
            </option>
          </select>
        </div>
        <div className="form-input">
          <label htmlFor="budget">Budget</label>
          <input
            required
            value={user.budget}
            onChange={handleChange}
            name="budget"
            type="number"
            placeholder="Enter Budget"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Create
        </button>
      </form>
    </Fragment>
  );
};

export default Form;
