import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Lower_header from "./Lower_header";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

const Container = styled.div`
  padding: 30px 20px;
`;

function QuestionPage({ match }) {
  const [question, setQuestion] = useState(false);

  function fetchQuestion() {
    axios
      .get("http://localhost:3030/questions/" + match.params.id, {
        withCredentials: true,
      })
      .then((response) => {
        setQuestion(response.data);
      });
  }

  useEffect(() => fetchQuestion(), []);
  return (
    <>
      <Container>
        {question && (
          <>
            <Lower_header>{question.title}</Lower_header>
            <ReactMarkdown plugins={[gfm]} children={question.content} />
          </>
        )}
      </Container>
    </>
  );
}

export default QuestionPage;

