import { Users, validationUser } from "../module/userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

class UsersController {
  async getProfile(req, res) {
    try {
      let user = await Users.findById(req.user._id);
      res.status(200).json({
        msg: "User registered successfully",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      let profile = await Users.findOne({ _id: req.user._id });
      if (!profile) {
        return res.status(404).json({
          msg: "Profile not found.",
          variant: "error",
          payload: null,
        });
      }

      const existingUser = await Users.findOne({ username: req.body.username });
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({
          msg: "Username already exists.",
          variant: "error",
          payload: null,
        });
      }

      if (!req.body.password) {
        req.body.password = profile.password;
      }

      const newProfile = await Users.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });

      res.status(200).json({
        msg: "Profile is updated",
        variant: "success",
        payload: newProfile,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const user = await Users.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          msg: "User not found.",
          variant: "error",
          payload: null,
        });
      }

      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: "Incorrect old password.",
          variant: "error",
          payload: null,
        });
      }

      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password = newHashedPassword;
      await user.save();

      res.status(200).json({
        msg: "Password updated successfully",
        variant: "success",
        payload: null,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async getUserSearch(req, res) {
    try {
      let { value = "", limit } = req.query;
      let text = value.trim();
      if (!text) {
        return res.status(400).json({
          msg: "write something",
          variant: "error",
          payload: null,
        });
      }
      const users = await Users.find({
        $or: [
          { fname: { $regex: text, $options: "i" } },
          { username: { $regex: text, $options: "i" } },
        ],
      }).limit(limit);
      if (!users.length) {
        return res.status(400).json({
          msg: "user not found",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "user found",
        variant: "success",
        payload: users,
      });
    } catch {
      res.status(500).json({
        msg: "server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async get(req, res) {
    try {
      const { limit = 10, skip = 1 } = req.query;
      const users = await Users.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (skip - 1));
      if (!users.length) {
        return res.status(400).json({
          msg: "Users is not defined",
          variant: "warning",
          payload: null,
        });
      }
      const total = await Users.countDocuments();
      res.status(200).json({
        msg: "All Users",
        variant: "success",
        payload: users,
        total,
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
      const { error } = validationUser(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const existUser = await Users.exists({ title: req.body.username });
      if (existUser) {
        return res.status(400).json({
          msg: "This username has been used",
          variant: "warning",
          payload: null,
        });
      }

      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await Users.create(req.body);
      res.status(201).json({
        msg: "User is created",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async register(req, res) {
    try {
      const { error } = validationUser(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "error",
          payload: null,
        });
      }

      const isUsername = await Users.findOne({ username: req.body.username });
      if (isUsername) {
        return res.status(400).json({
          msg: "username already exists",
          variant: "error",
          payload: null,
        });
      }

      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await Users.create(req.body);

      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        msg: "User registered successfully",
        variant: "success",
        payload: {
          token,
          user,
        },
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async login(req, res) {
    try {
      let { username, password } = req.body;
      const user = await Users.findOne({ username });
      if (!user) {
        return res.status(400).json({
          msg: "User or password is incorrect",
          variant: "error",
          payload: null,
        });
      }

      bcrypt.compare(password, user.password, async (err, data) => {
        if (err) {
          return res.status(400).json({
            msg: "User or password is incorrect",
            variant: "error",
            payload: null,
          });
        }

        const token = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
          msg: "Login successful",
          variant: "success",
          payload: {
            token,
            user,
          },
        });
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

export default new UsersController();
