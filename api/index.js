import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import UserRoutes from "./UserRoutes.js";
import QuestionRoutes from "./QuestionRoutes.js";
import TagRoutes from "./TagRoutes.js";
import VoteRoutes from "./VoteRoutes.js";
import CommentRoutes from "./CommentRoutes.js";


const app = express();
const port = 3030;


app.use(bodyParser.json({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("test");
});

app.use(UserRoutes);
app.use(QuestionRoutes);
app.use(TagRoutes);
app.use(VoteRoutes);
app.use(CommentRoutes);


app.listen(port, () => {
  console.log("listening on port:" + port);
});
