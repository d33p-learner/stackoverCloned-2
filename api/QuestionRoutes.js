import express from "express";
import db from "./db.js";

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
  db.select("*")
    .from("posts")
    .where({ id })
    .first()
    .then(question => {
      db.select("*")
        .from("question_tags")
        .join("tags", "tags.id", "=", "question_tags.tag_id")
        .then((tags) => {
          res.json({ question, tags });
        });
    })
    .catch(() => res.sendStatus(422));
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
