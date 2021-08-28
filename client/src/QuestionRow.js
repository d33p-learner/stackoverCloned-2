import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import UserLink from "./UserLink";
import WhoAndWhen from "./WhoAndWhen";
import When from "./When";

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

const QuestionLink = styled(Link)`
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

function QuestionRow({ title, id, author, createdAt }) {
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
        <QuestionLink to={"/questions/" + id}>{title}</QuestionLink>
        <WhoAndWhen>
          <When>{createdAt}</When> <UserLink>{author.email}</UserLink>
        </WhoAndWhen>
      </QuestionTitleArea>
    </StyledQuestionRow>
  );
}

QuestionRow.propTypes = {
  createdAt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  // tags: PropTypes.string,
  author: PropTypes.object,
};

export default QuestionRow;
