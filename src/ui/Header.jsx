import styled, { css } from "styled-components";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { useUserInterface } from "../contexts/UserInterfaceContext";

const StyledHeader = styled.header`
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  padding: 0 5rem;

  ${(props) =>
    !props.isOpen &&
    css`
      grid-column: 1 / -1;
    `}
`;

const Button = styled.button`
  margin-right: 2.4rem;
`;

const StyledHiOutlineBars3BottomLeft = styled(HiOutlineBars3BottomLeft)`
  fill: var(--color-primary-dark);
  height: 3rem;
  width: 3rem;
`;

const PageTitle = styled.h1``;

export default function Header() {
  const { isOpen, onToggle } = useUserInterface();

  return (
    <StyledHeader isOpen={isOpen}>
      <Button onClick={onToggle}>
        <StyledHiOutlineBars3BottomLeft />
      </Button>
      <PageTitle>Inventory</PageTitle>
    </StyledHeader>
  );
}
