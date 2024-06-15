import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const StyledSpinnerMini = styled.div`
  margin: 0;
  width: 2.5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid #b7c7d7;
  border-right-color: transparent;
  animation: ${rotate} 1s infinite linear;
`;

function SpinnerMini() {
  return <StyledSpinnerMini></StyledSpinnerMini>;
}

export default SpinnerMini;
