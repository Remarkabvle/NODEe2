import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    required: true,
    enum: ["female", "male"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "owner"],
    default: "admin",
  },
});

export const Users = model("Users", userSchema);

export const validateUser = (user) => {
  const schema = Joi.object({
    fname: Joi.string().required(),
    lname: Joi.string().allow(""),
    username: Joi.string().required(),
    password: Joi.string().required(),
    age: Joi.number().min(0),
    url: Joi.string().uri().allow(""),
    gender: Joi.string().valid("female", "male").required(),
    isActive: Joi.boolean(),
    budget: Joi.number().min(0).required(),
    role: Joi.string().valid("user", "admin", "owner").required(),
  });
  return schema.validate(user);
};
