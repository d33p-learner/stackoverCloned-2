import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const saltRounds = 10;

const UserRoutes = express.Router();

const secret = "secret123";

mongoose.connect("mongodb://localhost:27017/usersInfoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const userSchema = new mongoose.Schema({
  userId: String,
  email: String,
  password: String,
  token: String,
});

export const User = new mongoose.model("User", userSchema);

UserRoutes.get("/profile", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      console.log(err);
      res.status(403).send();
    } else {
      res.json(data);
    }
  });
});

UserRoutes.post("/login", (req, res) => {
  const { email, password } = req.body;
  // const isLoginOk = email === "test@example.com" && password === "test";

  User.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        const isLoggedIn = bcrypt.compareSync(
          req.body.password,
          foundUser.password
        );

        isLoggedIn &&
          jwt.sign(email, secret, (err, token) => {
            if (err) {
              res.status(403).send();
            } else {
              User.findOneAndUpdate(
                { email: email },
                { token: token },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.cookie("token", token).send();
                  }
                }
              );
            }
          });

        if (!isLoggedIn) {
          res.status(403).send();
        }
      }
    }
  });
});

UserRoutes.post("/register", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (!foundUser) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          const newUser = new User({
            userId: uuidv4(),
            email: req.body.email,
            password: hash,
          });

          newUser.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              jwt.sign(email, secret, (err, token) => {
                if (err) res.status(403).send();
                else {
                  User.findOneAndUpdate(
                    { email: email },
                    { token: token },
                    (err, doc) => {
                      if (err) {
                        console.log(err);
                      } else {
                        res
                          .cookie("token", token)
                          .status(201)
                          .send("User created");
                      }
                    }
                  );
                }
              });
            }
          });
        });
      } else {
        res.status(422).send("Email already exists. Please try to login.");
      }
    }
  });
});

UserRoutes.post("/logout", (req, res) => {
  res.clearCookie("token").send("ok");
});

export default UserRoutes;
