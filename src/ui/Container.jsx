import styled, { css } from "styled-components";
import { breakpoints } from "../utils/breakpoints";

export const containerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  max-width: 70rem;
  margin: 0 auto;
  margin-bottom: 10rem;
  border-radius: 2.4rem;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow-1);
  padding: 3rem;

  @media (max-width: ${breakpoints.mobileMedium}) {
    padding: 2rem;
  }
`;

const Container = styled.div`
  ${containerStyles}
`;

export default Container;
