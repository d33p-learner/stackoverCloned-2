import express from "express";
import mongoose from "mongoose";
import { User } from "./UserRoutes.js";
import { v4 as uuidv4 } from "uuid";
import { Tag, tagsSchema } from "./TagRoutes.js";

const QuestionRoutes = express.Router();

const connection = mongoose.connect("mongodb://localhost:27017/usersInfoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("useCreateIndex", true);

///////////////////////////////////////////////////////////

const postSchema = new mongoose.Schema({
  postId: String,
  title: String,
  content: String,
  parent_id: String,
  author_id: String,
});

export const Post = new mongoose.model("Post", postSchema);

///////////////////////////////////////////////////////////

const question_tagsSchema = new mongoose.Schema({
  question_id: String,
  tag_id: Number,
});

export const Question_tag = new mongoose.model(
  "Question_tag",
  question_tagsSchema
);

////////////////////////////////////////////////////////////

var db = mongoose.connection.collections;

// console.log(db);

QuestionRoutes.post("/questions", (req, res) => {
  const { title, content, tagIds } = req.body;
  const { token } = req.cookies;

  User.findOne({ token: token }, function (err, foundUser) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      if (foundUser) {
        const newPost = new Post({
          postId: uuidv4(),
          title: title,
          content: content,
          parent_id: null,
          author_id: foundUser.userId,
        });
        newPost.save();

        const questionTags = [];

        tagIds.forEach((tagId) => {
          questionTags.push({
            question_id: newPost.postId,
            tag_id: tagId,
          });
        });

        Question_tag.insertMany(questionTags, function (error, docs) {
          if (err) {
            console.log(err);
            res.sendStatus(422);
          } else {
            res.json(newPost);
          }
        });
      } else {
        res.sendStatus(422);
      }
    }
  });
});

QuestionRoutes.get("/questions/:id", (req, res) => {
  const id = req.params.id;
  const tagArray = [];
  var tagArrayName = [];

  Question_tag.find({ question_id: id }, function (err, foundQuestions) {
    foundQuestions.forEach((question) => {
      tagArray.push(question.tag_id);
    });

    // tagArray.forEach((tagid) => {
    //   Tag.findOne({ id: tagid }, function (err, foundTag) {
    //     tagArrayName.push(foundTag.name);
    //   });
    // });
  });

  Post.findOne({ postId: id }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      if (foundPost) {
        // console.log(tagArray);
        res.send({ foundPost, tagArray });

        // db.question_tags.aggregate(
        //   [
        //     {
        //       $lookup: {
        //         from: "tags",
        //         localField: "tag_id",
        //         foreignField: "id",
        //         as: "tags",
        //       },
        //     },
        //   ]
        // );
      }
    }
  });
});

QuestionRoutes.get("/questions", (req, res) => {
  Post.find({ parent_id: null }, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      if (foundPosts) {
        res.json(foundPosts);
      } else {
        res.sendStatus(422);
      }
    }
  });
});

export default QuestionRoutes;
