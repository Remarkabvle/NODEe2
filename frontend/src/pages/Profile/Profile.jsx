import "react-toastify/dist/ReactToastify.css";
import "./Profile.scss";

import React, { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetProfileQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "../../context/api/userApi";

import FemaleImg from "../../assets/not-fml.jpeg";
import MaleImg from "../../assets/not.jpg";
import Module from "../../components/Module/Module";

const initialState = {
  fname: "",
  lname: "",
  username: "",
  age: "",
  budget: "",
  gender: "",
};

const Profile = () => {
  const [formData, setFormData] = useState(initialState);
  const [module, setModal] = useState(false);
  const [passwordModule, setPasswordModule] = useState(false);

  const { data, refetch } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const user = data?.payload;

  useEffect(() => {
    if (data) {
      setFormData({
        fname: data.payload.fname,
        lname: data.payload.lname,
        username: data.payload.username,
        age: data.payload.age,
        budget: data.payload.budget,
        gender: data.payload.gender,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setModal(false);
      refetch();
      toast.success("Profile updated successfully."); // Show success toast
    } catch (error) {
      toast.error("Failed to update profile. Please try again."); // Show error toast
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = e.target.elements;
    try {
      await updatePassword({
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      }).unwrap();
      setPasswordModule(false);
      refetch();
      toast.success("Password updated successfully."); // Show success toast
    } catch (error) {
      toast.error("Failed to update password. Please try again."); // Show error toast
    }
  };

  return (
    <Fragment>
      <div className="container profile">
        <div className="profile__img">
          <img src={user?.gender === "male" ? MaleImg : FemaleImg} alt="Profile" />
        </div>
        <div className="profile__info">
          {["fname", "lname", "gender", "username", "budget", "age"].map((field) => (
            <div className="fd" key={field}>
              <h3>{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
              <p>{user?.[field]}</p>
            </div>
          ))}
          <button onClick={() => setModal((prev) => !prev)}>Edit Profile</button>
          <button onClick={() => setPasswordModule((prev) => !prev)}>Edit Password</button>
        </div>
      </div>
      {module && (
        <Module bg={"#aaa8"} width={550} close={setModal}>
          <form onSubmit={handleSubmit} className="edit__profile">
            {["fname", "lname", "username", "age", "budget"].map((field) => (
              <div className="fd" key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                />
              </div>
            ))}
            <div className="fd">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                name="gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button type="submit">Save</button>
          </form>
        </Module>
      )}
      {passwordModule && (
        <Module bg={"#aaa8"} width={300} close={setPasswordModule}>
          <form
            className="edit__profile__password"
            onSubmit={handlePasswordSubmit}
          >
            {["oldPassword", "newPassword"].map((field) => (
              <div className="fd" key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace("Password", " Password")}
                </label>
                <input
                  id={field}
                  type="password"
                  placeholder={`${field.charAt(0).toUpperCase() + field.slice(1).replace("Password", " Password")}`}
                  name={field}
                  required
                />
              </div>
            ))}
            <button>Update Password</button>
          </form>
        </Module>
      )}
      <ToastContainer /> 
    </Fragment>
  );
};

export default Profile;
