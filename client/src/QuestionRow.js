import React from "react";
import styled from "styled-components";

const QuestionStat = styled.div`
  text-align: center;
  display: inline-block;
  font-size: 1.2 rem;
  margin-top: 6px;
  color: #aaa;
  span {
    font-size: 0.7rem;
    display: block;
    font-weight: 300;
    margin-top: 4px;
  }
`;

const QuestionTitleArea = styled.div`
  padding: 0 30px;
`;

const Tag = styled.span`
  display: inline-block;
  margin-right: 5px;
  background-color: #3e4a52;
  color: #9cc3db;
  padding: 7px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const QuestionLink = styled.a`
  text-decoration: none;
  color: #3ca4ff;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 5px;
`;

const StyledQuestionRow = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px 15px 10px;
  display: grid;
  grid-template-columns: repeat(3, 50px) 1fr;
  border-top: 1px solid #555;
`;

const WhoandWhen = styled.div`
  display: inline-block;
  color: #aaa;
  font-size: 0.8rem;
  float: right;
  padding: 10px 0;
`;

const UserLink = styled.a`
    color:#3ca4ff;
`;

function QuestionRow() {
  return (
    <StyledQuestionRow>
      <QuestionStat>
        1<span>Votes</span>
      </QuestionStat>
      <QuestionStat>
        0<span>Answers</span>
      </QuestionStat>
      <QuestionStat>
        8<span>Views</span>
      </QuestionStat>
      <QuestionTitleArea>
        <QuestionLink>Some random question on stackoverflow</QuestionLink>
        <WhoandWhen>
            asked 2 mins ago <UserLink>Dawid</UserLink>
        </WhoandWhen>
        <Tag>javascript</Tag>
        <Tag>parsing</Tag>
        <Tag>literals</Tag>
        <Tag>quotes</Tag>
      </QuestionTitleArea>
    </StyledQuestionRow>
  );
}

export default QuestionRow;
