import styled from "styled-components";
import PropTypes from 'prop-types';

const StyledTag = styled.span`
  display: inline-block;
  margin-right: 5px;
  background-color: #3e4a52;
  color: #9cc3db;
  padding: 7px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

function Tag(name) {
    return ( <StyledTag>{name}</StyledTag>);
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Tag;


