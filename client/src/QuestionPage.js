import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Lower_header from "./Lower_header";
import Answer_Header from "./Answer_Header";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Helmet } from "react-helmet";
import WhoAndWhen from "./WhoAndWhen";
import UserLink from "./UserLink";
import Tag from "./Tag";
import VotingButtons from "./VotingButtons";
import Comments from "./Comments";
import BlueButton from "./BlueButton";
import PostBodyTextArea from "./PostBodyTextArea";
import When from "./When";

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

function QuestionPage({ match }) {
  const [question, setQuestion] = useState(false);
  const [tags, setTags] = useState([]);
  const [userVote, setUserVote] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [questionComments, setQuestionComments] = useState([]);
  const [answerBody, setAnswerBody] = useState("");
  const [answersComments, setAnswersComments] = useState([]);
  const [answers, setAnswers] = useState([]);

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

  function getQuestionComments() {
    axios
      .get("http://localhost:3030/posts/comments/" + match.params.id, {
        withCredentials: true,
      })
      .then((response) => {
        setQuestionComments(response.data);
      });
  }

  function getAnswersComments(answers) {
    const ids = answers.map((answer) => answer.id).join(",");
    axios
      .get("http://localhost:3030/posts/comments/" + (ids), {
        withCredentials: true,
      })
      .then((response) => {
        setAnswersComments(response.data);
      });
  }

  function getAnswers() {
    axios
      .get("http://localhost:3030/posts/answers/" + match.params.id, {
        withCredentials: true,
      })
      .then((response) => {
        setAnswers(response.data);
        getAnswersComments(response.data);
      });
  }

  function postAnswer(ev) {
    ev.preventDefault();
    const data = { postId: question.id, content: answerBody, type: "answer" };
    axios
      .post("http://localhost:3030/posts", data, {
        withCredentials: true,
      })
      .then((response) => {
        setAnswerBody("");
        setAnswers(response.data);
      });
  }

  useEffect(() => {
    getQuestion();
    getAnswers();
    getQuestionComments();
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
                initialTotal={voteCount}
                initialUserVote={userVote}
                postId={question.id}
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
                  <When>{question.created_at}</When> <UserLink>{question.email}</UserLink>
                  </WhoAndWhen>
                </QuestionMeta>
              </div>
            </PostBody>
          </>
        )}

        {questionComments && (
          <Comments initialComments={questionComments} postId={question.id} />
        )}

        <hr />
        <Answer_Header style={{ margin: "30px 0 20px" }}>Answers</Answer_Header>

        {answers.map((answer) => (
          <div>
            <PostBody>
              <VotingButtons
                style={{ marginTop: "10px" }}
                initialTotal={answer.votes_sum}
                initialUserVote={answer.user_vote}
                postId={answer.id}
              />
              <div>
                <ReactMarkdown plugins={[gfm]} children={answer.content} />
                <WhoAndWhen style={{float:'none',width:'100%'}}>
                  <When>{answer.created_at}</When>&nbsp;
                  <UserLink >{answer.email}</UserLink>
                </WhoAndWhen>
              </div>
              {/* <ReactMarkdown plugins={[gfm]} children={answer.content} /> */}
            </PostBody>
            <Comments
              initialComments={answersComments.filter(
                (comment) => comment.parent_id === answer.id
              )}
              postId={answer.id}
            />
          </div>
        ))}

        <hr />

        <Answer_Header style={{ margin: "30px 0 20px" }}>
          Your Answer
        </Answer_Header>
        <PostBodyTextArea
          value={answerBody}
          placeholder={"Your Answer goes here. You can use Markdown."}
          handlePostBodyChange={(value) => {
            setAnswerBody(value);
          }}
        />
        <BlueButton
          onClick={(ev) => {
            postAnswer(ev);
          }}
        >
          Post your answer
        </BlueButton>
      </Container>
    </>
  );
}

export default QuestionPage;
