import styled from "styled-components";

const BlueButton = styled.button`
  background-color: #378ad3;
  color: #fff;
  border: 0;
  border-radius: 5px;
  padding: ${props => props.size === 'sm' ? '5px 7px' : '12px 20px'};
  font-size: ${props => props.size === 'sm' ? '.8rem' : '1.1rm'};
`;

export default BlueButton;
