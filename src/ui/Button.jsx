import styled, { css } from "styled-components";

export const buttonStyles = css`
  font-weight: 500;
  padding: 1.25rem 2rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: var(--ts);

  ${(props) => variants[props.variant]}

  &:disabled {
    background-color: var(--color-primary-light);
    cursor: not-allowed;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

const Button = styled.button`
  ${buttonStyles}
`;

const variants = {
  primary: css`
    background-color: var(--color-primary);
    color: var(--color-white);

    &:hover {
      background-color: var(--color-primary-light);
    }

    & svg {
      fill: var(--color-white);
    }
  `,
  secondary: css`
    color: var(--color-white);
    color: #1f2937;
    border: 1px solid var(--color-gray-secondary);

    &:hover {
      background-color: #f3f4f6;
    }

    & svg {
      fill: #1f2937;
    }
  `,
};

export default Button;
