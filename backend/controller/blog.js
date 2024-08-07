import { Blogs, validateBlog } from "../module/blogSchema.js";

class BlogsController {
  async get(req, res) {
    try {
      const blogs = await Blogs.find().populate([
        {
          path: "userId",
          select: ["fnmae", "lname"],
        },
      ]);
      if (!blogs.length) {
        return res.status(400).json({
          msg: "Blog is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Blogs",
        variant: "success",
        payload: blogs,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async create(req, res) {
    try {
      const { error } = validateBlog(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const blog = await Blogs.create({ ...req.body, userId: req.user._id });
      res.status(201).json({
        msg: "Blog is created",
        variant: "success",
        payload: blog,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async getBlogSearch(req, res) {
    try {
      let { value = "", limit = 10 } = req.query;
      let text = value.trim();
      if (!text) {
        return res.status(400).json({
          msg: "Please provide a search query.",
          variant: "error",
          payload: null,
        });
      }
      const blogs = await Blogs.find({
        $or: [
          { title: { $regex: text, $options: "i" } },
          { desc: { $regex: text, $options: "i" } },
        ],
      }).limit(parseInt(limit));

      if (!blogs.length) {
        return res.status(404).json({
          msg: "No blogs found.",
          variant: "error",
          payload: null,
        });
      }

      res.status(200).json({
        msg: "Blogs found.",
        variant: "success",
        payload: blogs,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error.",
        variant: "error",
        payload: null,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const existBlog = await Blogs.findById(id);
      if (!existBlog) {
        return res.status(400).json({
          msg: "Blog is not defined",
          variant: "warning",
          payload: null,
        });
      }
      const blog = await Blogs.findByIdAndDelete(id, { new: true });

      res.status(200).json({
        msg: "Blog is deleted",
        variant: "success",
        payload: blog,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new BlogsController();
