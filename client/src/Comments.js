import styled from "styled-components";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import BlueLinkButton from "./BlueLinkButton";
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const CommentsOuter = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 70px;
`;

function Comments(props) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);

  function handleAddComment(content) {
    axios
      .post(
        "http://localhost:3030/posts/",
        { content, postId: props.postId, type:'comment' },
        { withCredentials: true }
      )
      .then((response) => {
        setCurrentComments(response.data);
        setShowCommentForm(false);
      });
  }

  const comments = currentComments.length === 0 ? props.initialComments : currentComments;

  return (
    <CommentsOuter>
      {comments.map((questionComment) => (
        <Comment comment={questionComment} />
      ))}
      {showCommentForm && (
        <CommentForm
            onAddCommentClick={(content) => handleAddComment(content)}
          />
      )}

      {!showCommentForm && (
        <BlueLinkButton
          onClick={() => setShowCommentForm(true)}
          style={{ padding: "10px 0", marginLeft: "70px" }}
        >
          Add comment
        </BlueLinkButton>
      )}
    </CommentsOuter>

  );
}

Comments.propTypes = {
    initialComments: PropTypes.array.isRequired,
    postId: PropTypes.number.isRequired,
};

export default Comments;
