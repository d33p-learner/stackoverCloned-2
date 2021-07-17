import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";

const ArrowUp = styled.div`
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid ${props => props.uservote===1 ? '#f48024' : '#888'};
  padding: 0;
`;
const ArrowBottom = styled.div`
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid ${props => props.uservote===-1 ? '#f48024' : '#888'};
  padding: 0;
`;
const ArrowButton = styled.button`
  border: 0;
  background: none;
  font-size: 2rem;
  cursor: pointer;
  text-align: center;
  padding: 0;
`;
const Total = styled.div`
  text-align: center;
  width: 40px;
  padding: 5px 0;
  font-size: 1.4rem;
  line-height: 1.4rem;
  color: #888;
`;



function VotingButtons(props) {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(null);

  function handleVoteClick(direction) {
    if (direction === currentUserVote) {
      setCurrentUserVote(null);
      setCurrentTotal(direction === 1 ? total - 1 : total + 1);
    } else {
      setCurrentUserVote(direction);
      setCurrentTotal(total + direction - currentUserVote);
    }

    const directionName = direction === 1 ? "up" : "down";
    axios
      .post(
        "http://localhost:3030/vote/" + directionName + "/" + props.postId,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        setCurrentTotal(response.data);
      });
  }

  const total = currentTotal || props.initialTotal || 0;
  const userVote = currentUserVote === null ? props.initialUserVote : currentUserVote;
  
  return (
    <div {...props}>
      <ArrowButton onClick={() => handleVoteClick(1)}>
        <ArrowUp uservote={userVote} />
      </ArrowButton>
      <Total>{total}</Total>
      <ArrowButton onClick={() => handleVoteClick(-1)}>
        <ArrowBottom uservote={userVote}/>
      </ArrowButton>
    </div>
  );
}

VotingButtons.propTypes = {
  initialTotal: PropTypes.number.isRequired,
  initialUserVote: PropTypes.number,
  postId: PropTypes.number.isRequired,
};

export default VotingButtons;
