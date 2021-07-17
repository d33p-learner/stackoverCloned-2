import express from "express";
import db from "./db.js";
import { getLoggedInUser } from "./UserFunctions.js";

const QuestionRoutes = express.Router();

QuestionRoutes.post("/questions", (req, res) => {
  const { title, content, tags } = req.body;
  const { token } = req.cookies;
  db.select("id")
    .from("users")
    .where({ token })
    .first()
    .then((user) => {
      if (user && user.id) {
        db("posts")
          .insert({
            title,
            content,
            parent_id: null,
            author_id: user.id,
          })
          .then((questionId) => {
            const questionTags = [];
            tags.forEach((tag) => {
              questionTags.push({ question_id: questionId, tag_id: tag });
            });

            db("question_tags")
              .insert(questionTags)
              .then(() => res.json(questionId).sendStatus(201))
              .catch((e) => res.sendStatus(422));
          })
          .catch((e) => res.sendStatus(422));
      } else {
        res.sendStatus(403);
      }
    });
});

QuestionRoutes.get("/questions/:id", (req, res) => {
  const id = req.params.id;
  getLoggedInUser(req.cookies.token).then(user => {
    db.select(
      "posts.*",
      db.raw("sum(votes.vote ) as vote_sum"),
      db.raw("users.email"),
      db.raw('votes2.vote as user_vote')
    )
      .from("posts")
      .join("users", "users.id", "=", "posts.author_id")
      .leftJoin("votes", "posts.id", "=", "votes.post_id")
      .leftJoin(db.raw('votes votes2 on votes2.post_id = posts.id and votes2.user_id = '+user.id))
      .where({ "posts.id": id })
      .groupBy("posts.id")
      .first()
      .then((question) => {
        db.select("*")
          .from("question_tags")
          .where({ question_id: question.id })
          .join("tags", "tags.id", "=", "question_tags.tag_id")
          .then((tags) => {
            res.json({ question, tags });
          });
      })
      .catch(() => res.sendStatus(422));
  });
});

QuestionRoutes.get("/questions", (req, res) => {
  db.select("*")
    .from("posts")
    .where({ parent_id: null })
    .orderBy("id", "desc")
    .then((questions) => {
      res.json(questions);
    })
    .catch(() => res.sendStatus(422));
});

export default QuestionRoutes;
