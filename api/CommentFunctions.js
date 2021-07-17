import db from "./db.js";

export function getPostComments(postId) {
  return db
    .select("*")
    .from("posts")
    .join("users", "users.id", "=", "posts.author_id")
    .where({
      parent_id: postId,
    });
}
