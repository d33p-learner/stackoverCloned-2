import React from "react";
import styled from "styled-components";
import QuestionRow from "./QuestionRow";
import { Link } from "react-router-dom";
import Lower_header from "./Lower_header";
import BlueButtonLink from "./BlueButtonLink";

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  padding: 30px 20px;
`;

function QuestionsPage() {
  return (
    <main>
      <HeaderRow>
        <Lower_header style={{margin:0}}>Top Questions</Lower_header>
        <BlueButtonLink to="/ask">Ask&nbsp;Questions</BlueButtonLink>
      </HeaderRow>
      <QuestionRow />
      <QuestionRow />
      <QuestionRow />
      <QuestionRow />
      <QuestionRow />
      <QuestionRow />
    </main>
  );
}

export default QuestionsPage;
