import mongoose from "mongoose";
import Joi from "joi";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

export const Blogs = mongoose.model("Blogs", blogSchema);

export function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    userId: Joi.string().required(),
  });

  return schema.validate(blog);
}
  