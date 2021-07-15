import React from "react";
import styled from "styled-components";
import QuestionRow from "./QuestionRow";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Lower_header from "./Lower_header";
import BlueButtonLink from "./BlueButtonLink";
import axios from "axios";

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  padding: 30px 20px;
`;

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);

  function fetchQuestion() {
    axios
      .get("http://localhost:3030/questions", {
        withCredentials: true,
      })
      .then((response) => {
        setQuestions(response.data);
      });
  }

  useEffect(() => fetchQuestion(), []);

  return (
    <main>
      <HeaderRow>
        <Lower_header style={{ margin: 0 }}>Questions</Lower_header>
        <BlueButtonLink to="/ask">Ask&nbsp;Questions</BlueButtonLink>
      </HeaderRow>
      {questions &&
        questions.length > 0 &&
        questions.map((question) => (
          <QuestionRow title={question.title} id={question.id} />
        ))}
    </main>
  );
}

export default QuestionsPage;
