import express from "express";
import { getPostComments } from "./CommentFunctions.js";
import db from "./db.js";
import { getLoggedInUser } from "./UserFunctions.js";
const CommentRoutes = express.Router();

CommentRoutes.get("/comments/:postId", (req, res) => {
  const postId = req.params.postId;
  getPostComments(postId)
    .then((comments) => {
      res.json(comments);
    })
    .catch((e) => console.log(e));
});

CommentRoutes.post("/comments", (req, res) => {
  const { content, postId } = req.body;
  getLoggedInUser(req.cookies.token).then((user) => {
    db('posts')
      .insert({
        title:null,
        content,
        parent_id: postId,
        author_id: user.id,
      })
      .then(() => {
        getPostComments(postId)
        .then((comments) => {
          res.json(comments);
        })
        .catch((e) => console.log(e));
      });
  });
});

export default CommentRoutes;
