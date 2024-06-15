import styled, { keyframes } from "styled-components";
import SkeletonLoading from "./SkeletonLoading";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledCard = styled.div`
  border-radius: 2.4rem;
  background-color: var(--color-white);
  padding: 3rem;
  min-width: 34rem;
  cursor: pointer;
  transition: var(--ts);
  animation: ${fadeIn} 0.5s ease backwards;
  animation-delay: ${(props) => props.delay || 0}s;
  box-shadow: var(--box-shadow-1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-2);

    svg {
      transform: rotate(-10deg) scale(1.1);
    }
  }

  & svg {
    fill: var(--color-primary);
    width: 4rem;
    height: 4rem;
    transition: var(--ts);
  }
`;

const CardValue = styled.p`
  font-size: 3.6rem;
  font-weight: 600;
`;

const CardLabel = styled.p`
  color: var(--color-accent-secondary);
  text-transform: capitalize;
`;

export default function Card({
  value,
  label,
  icon: Icon,
  delay,
  isLoading = false,
}) {
  return (
    <StyledCard delay={delay}>
      <Icon></Icon>
      {isLoading ? (
        <CardValue>
          <SkeletonLoading height="5.4rem" />
        </CardValue>
      ) : (
        <CardValue>{value}</CardValue>
      )}

      <CardLabel>{label}</CardLabel>
    </StyledCard>
  );
}
