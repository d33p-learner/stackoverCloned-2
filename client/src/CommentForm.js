import styled from "styled-components";
import BlueButton from "./BlueButton";
import { useState } from "react";

const StyledTextarea = styled.textarea`
  background: none;
  border: 1px solid #777;
  border-radius: 3px;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 20px;
  font-family: inherit;
  line-height: 1.3rem;
  color: #fff;
`;

const CommentFooter = styled.div`
  text-align: right;
`;

function CommentForm(props) {
  const [content, setContent] = useState("");

  function addComment(ev) {
    ev.preventDefault();
    props.onAddCommentClick(content);
    setContent("");
  }

  return (
    <form onSubmit={(ev) => addComment(ev)}>
      <StyledTextarea
        rows={3}
        value={content}
        onChange={(ev) => {
          setContent(ev.target.value);
        }}
        placeholder={
          "Use comments to ask for more information or suggest improvements. Avoid answering questions in comments."
        }
      />
      <CommentFooter>
        <BlueButton type={"submit"} size="sm">
          Add comment
        </BlueButton>
      </CommentFooter>
    </form>
  );
}

export default CommentForm;
