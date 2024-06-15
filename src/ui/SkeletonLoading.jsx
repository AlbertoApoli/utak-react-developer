import styled, { keyframes } from "styled-components";

const skeletonLoading = keyframes`
  0% {
    background-color: hsl(0, 0%, 90%);
  }
  100% {
    background-color: hsl(0, 0%, 95%);
  }
`;

const SkeletonLoading = styled.div`
  width: 100%;
  height: ${(props) => props.height || "2.5rem"};
  opacity: 0.7;
  animation: ${skeletonLoading} 1s linear infinite alternate;
  margin-bottom: 0.25rem;
  border-radius: 0.125rem;

  &:last-child {
    margin-bottom: 0;
    width: 80%;
  }
`;

export default SkeletonLoading;
