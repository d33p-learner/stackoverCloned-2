import express from "express";
import { getPostChildren } from "./PostsFunctions.js";
import db from "./db.js";
import { getLoggedInUser } from "./UserFunctions.js";
const PostRoutes = express.Router();

PostRoutes.get("/posts/:type/:postIds", (req, res) => {
  const postIds = req.params.postIds.split(",");
  const type = req.params.type;
  const token = req.cookies.token;

  getLoggedInUser(token).then((user) => {
    getPostChildren(postIds, type, user.id)
      .then((comments) => {
        res.json(comments);
      })
      .catch((e) => console.log(e));
  });
});

PostRoutes.post("/posts", (req, res) => {
  const { content, postId, type } = req.body;
  getLoggedInUser(req.cookies.token).then((user) => {
    db("posts")
      .insert({
        title: null,
        content,
        parent_id: postId,
        author_id: user.id,
        type,
      })
      .then(() => {
        getPostChildren([postId], type, user.id)
          .then((comments) => {
            res.json(comments);
          })
          .catch((e) => console.log(e));
      });
  });
});

export default PostRoutes;
