import styled from "styled-components";

const StyledWhoAndWhen = styled.div`
  display: inline-block;
  color: #aaa;
  font-size: 0.8rem;
  float: right;
  text-align: right;
  padding: 10px 0;
  margin-left: 7px;
`;

function WhoAndWhen(props) {
  return <StyledWhoAndWhen {...props} />;
}

export default WhoAndWhen;
