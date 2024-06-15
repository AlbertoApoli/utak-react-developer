import { Outlet } from "react-router-dom";
import styled, { css } from "styled-components";
import { useUserInterface } from "../contexts/UserInterfaceContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { breakpoints } from "../utils/breakpoints";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 25rem 1fr;
  grid-template-rows: 10rem 1fr;
  height: 100vh;

  ${(props) =>
    !props.isOpen &&
    css`
      grid-template-columns: 1fr;
    `};
`;

const Main = styled.main`
  grid-row: 2 / -1;
  padding: 0 5rem;
  overflow-y: auto;

  ${(props) =>
    !props.isOpen &&
    css`
      grid-column: 1 / -1;
    `};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 0 2.5rem;
  }
`;

export default function AppLayout() {
  const { isOpen } = useUserInterface();

  return (
    <StyledAppLayout isOpen={isOpen}>
      <Sidebar />
      <Header />
      <Main isOpen={isOpen}>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
}
