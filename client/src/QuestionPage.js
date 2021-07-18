import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Lower_header from "./Lower_header";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Helmet } from "react-helmet";
import WhoAndWhen from "./WhoAndWhen";
import When from "./When";
import UserLink from "./UserLink";
import Tag from "./Tag";
import VotingButtons from "./VotingButtons";
import BlueLinkButton from "./BlueLinkButton";
import CommentForm from "./CommentForm";

const Container = styled.div`
  padding: 30px 20px;
`;
const QuestionMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
`;
const QuestionTitle = styled(Lower_header)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
`;
const PostBody = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  column-gap: 20px;
  margin-bottom: 20px;
`;

const CommentsOuter = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 70px;
`;

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

function QuestionPage({ match }) {
  const [question, setQuestion] = useState(false);
  const [tags, setTags] = useState([]);
  const [userVote, setUserVote] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [questionComments, setQuestionComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);

  function setCommentVote(commentId, userVote) {
    let newQuestionComments = [];
    questionComments.forEach((comment, commentIndex) => {
      newQuestionComments.push(comment);

      if (comment.id == commentId) {
        const prevUserVote = newQuestionComments[commentIndex].user_vote;
        if (prevUserVote === 1 && userVote === 1) {
          newQuestionComments[commentIndex].votes_sum -= 1;
        }
        if (prevUserVote === 1 && userVote === -1) {
          newQuestionComments[commentIndex].votes_sum -= 2;
        }
        if (prevUserVote === -1 && userVote === 1) {
          newQuestionComments[commentIndex].votes_sum += 2;
        }
        if (prevUserVote === -1 && userVote === -1) {
          newQuestionComments[commentIndex].votes_sum += 1;
        }
        if (prevUserVote === null) {
          newQuestionComments[commentIndex].votes_sum -= userVote;
        }
        newQuestionComments[commentIndex].user_vote = prevUserVote;
      }
    });
    setQuestionComments(newQuestionComments);
  }

  function updateCommentVotesSum(commentId, sum) {
    let newComments = questionComments;
    newComments.forEach((comment, commentIndex) => {
      if (comment.id === commentId) {
        newComments[commentIndex].votes_sum = sum;
      }
    });
  }

  function getQuestion() {
    axios
      .get("http://localhost:3030/questions/" + match.params.id, {
        withCredentials: true,
      })
      .then((response) => {
        setQuestion(response.data.question);
        const voteSum = response.data.question.vote_sum;
        setVoteCount(voteSum === null ? 0 : voteSum);
        setUserVote(response.data.question.user_vote);
        setTags(response.data.tags);
      });
  }

  function getComments() {
    axios
      .get("http://localhost:3030/comments/" + match.params.id, {
        withCredentials: true,
      })
      .then((response) => {
        setQuestionComments(response.data);
      });
  }

  function handleOnArrowUpClick(postId) {
    if (postId === question.id) {
      setUserVote(userVote === 1 ? 0 : 1);
    } else {
      setCommentVote(postId, 1);
    }
    axios
      .post(
        "http://localhost:3030/vote/up/" + postId,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (postId === question.id) {
          setVoteCount(response.data);
        } else {
          updateCommentVotesSum(postId, response.data);
        }
      });
  }

  function handleOnArrowDownClick(postId) {
    if (postId === question.id) {
      setUserVote(userVote === -1 ? 0 : -1);
    } else {
      setCommentVote(postId, -1);
    }
    axios
      .post(
        "http://localhost:3030/vote/down/" + postId,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (postId === question.id) {
          setVoteCount(response.data);
        } else {
          updateCommentVotesSum(postId, response.data);
        }
      });
  }

  function handleAddComment(content) {
    axios
      .post(
        "http://localhost:3030/comments/",
        { content, postId: question.id },
        { withCredentials: true }
      )
      .then((response) => {
        setQuestionComments(response.data);
        setShowCommentForm(false);
      });
  }

  useEffect(() => {
    getQuestion();
    getComments();
  }, []);
  return (
    <>
      <Container>
        {question && (
          <>
            <Helmet>
              <title>{question.title} - StackOvercloned</title>
            </Helmet>

            <QuestionTitle>{question.title}</QuestionTitle>

            <PostBody>
              <VotingButtons
                style={{ marginTop: "10px" }}
                total={voteCount}
                userVote={userVote}
                onArrowUpClick={() => handleOnArrowUpClick(question.id)}
                onArrowDownClick={() => handleOnArrowDownClick(question.id)}
              />
              <div>
                <ReactMarkdown plugins={[gfm]} children={question.content} />
                <QuestionMeta>
                  <div>
                    {tags.map((tag) => {
                      return <Tag key={tag.id} name={tag.name} />;
                    })}
                  </div>
                  <WhoAndWhen>
                    x time ago <UserLink>{question.email}</UserLink>
                  </WhoAndWhen>
                </QuestionMeta>
              </div>
            </PostBody>
          </>
        )}

        {questionComments && questionComments.length > 0 && (
          <CommentsOuter>
            {questionComments.map((questionComment) => (
              <CommentBox>
                <VotingButtons
                  size={"sm"}
                  onArrowUpClick={() => handleOnArrowUpClick(questionComment.id)}
                  onArrowDownClick={() => handleOnArrowDownClick(questionComment.id)}
                  total={ questionComment.votes_sum === null ? 0 : questionComment.votes_sum }
                  userVote={questionComment.user_vote}
                />
                <div>
                  {questionComment.content}
                  <WhoAndWhen style={{ padding: 0, float: "none" }}>
                    &nbsp;—&nbsp;
                    <UserLink>{questionComment.email}</UserLink> &nbsp;x times
                    ago
                  </WhoAndWhen>
                </div>
              </CommentBox>
            ))}
          </CommentsOuter>
        )}

        {showCommentForm && (
          <CommentsOuter>
            <CommentForm
              onAddCommentClick={(content) => handleAddComment(content)}
            ></CommentForm>
          </CommentsOuter>
        )}

        {!showCommentForm && (
          <BlueLinkButton
            onClick={() => setShowCommentForm(true)}
            style={{ padding: "10px 0", marginLeft: "70px" }}
          >
            Add comment
          </BlueLinkButton>
        )}
      </Container>
    </>
  );
}

export default QuestionPage;
