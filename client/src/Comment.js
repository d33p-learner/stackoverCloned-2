import VotingButtons from "./VotingButtons";
import WhoAndWhen from "./WhoAndWhen";
import UserLink from "./UserLink";
import styled from "styled-components";
import When from "./When";

const CommentBox = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  column-gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  font-size: 0.8rem;
  line-height: 1rem;
  color: #ddd;
`;

function Comment(props) {
  return (
    <CommentBox>
      <VotingButtons
        size={"sm"}
        initialTotal={
          props.comment.votes_sum === null ? 0 : props.comment.votes_sum
        }
        InitialUserVote={props.comment.user_vote}
        postId={props.comment.id}
      />
      <div>
        {props.comment.content}
        <WhoAndWhen style={{ padding: 0, float: "none" }}>
          &nbsp;—&nbsp;
          <UserLink>{props.comment.email}</UserLink> &nbsp;
          <When>{props.comment.created_at}</When>
        </WhoAndWhen>
      </div>
    </CommentBox>
  );
}

export default Comment;
