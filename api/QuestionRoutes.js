import express from "express";
import mongoose from "mongoose";
import { User } from "./UserRoutes.js";

const QuestionRoutes = express.Router();

mongoose.connect("mongodb://localhost:27017/usersInfoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("useCreateIndex", true);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  parent_id: String,
  author_id: Number,
});

const Post = new mongoose.model("Post", postSchema);

// const newPost = new Post({
//   title: "Question",
//   content: "This is the answer",
// });

// newPost.save();

QuestionRoutes.post("/questions", (req, res) => {
  const { title, content } = req.body;
  const { token } = req.cookies;

  User.find({ token: token }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        const newPost = new Post({
          title: title,
          content: content,
          parent_id: foundUser._id,
          author_id: 0,
        });

        newPost.save();
        res.sendStatus(201);
      } else {
        res.sendStatus(403);
      }
    }
  });
});

export default QuestionRoutes;
