import express from "express";
import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);
const TagRoutes = express.Router();

mongoose.connect("mongodb://localhost:27017/usersInfoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("useCreateIndex", true);

export const tagsSchema = new mongoose.Schema({
  name: String,
});

tagsSchema.plugin(AutoIncrement, { inc_field: "id" });

export const Tag = new mongoose.model("Tag", tagsSchema);

// const newTag = new Tag({
//   name: "React",
// });

// newTag.save();

TagRoutes.get("/tags", (req, res) => {
  Tag.find({}, function (err, foundTags) {
    if (err) {
      console.log(err);
    } else {
      if (foundTags) {
        // console.log(foundTags);
        res.json(foundTags);
      } else {
        res.sendStatus(422);
      }
    }
  });
});

export default TagRoutes;
