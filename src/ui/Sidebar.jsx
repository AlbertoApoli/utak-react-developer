import {
  HiMiniChartPie,
  HiMiniCog6Tooth,
  HiMiniShoppingBag,
  HiSparkles,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { useUserInterface } from "../contexts/UserInterfaceContext";

const Nav = styled.nav`
  grid-column: 1 / 2;
  grid-row: 1 / -1;
  background-color: var(--color-primary-dark);
  /* overflow: hidden; */
  border-radius: 0 2rem 2rem 0;
  width: 25rem;
  transition: var(--ts);

  ${(props) =>
    !props.isOpen &&
    css`
      width: 0;

      & * {
        display: none;
      }
    `}
`;

const Logo = styled.a`
  height: 10rem;
  color: var(--color-white);
  font-size: 3.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  & span {
    position: relative;

    & > svg {
      fill: #febc7e;
      position: absolute;
      left: -3rem;
      top: 0;
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1.8rem;
  padding: 1.2rem 1.7rem;
  color: #c2d1d0;
  transition: var(--ts);

  ${(props) =>
    props.active &&
    css`
      color: var(--color-white);
      border-left: 5px solid var(--color-secondary);
      font-weight: 500;
    `}

  &:hover {
    color: var(--color-white);

    svg {
      transform: rotate(-10deg) scale(1.1);
    }
  }

  & svg {
    width: 2rem;
    height: 2rem;
    transition: var(--ts);
  }
`;

export default function Sidebar() {
  const { isOpen, onToggle } = useUserInterface();

  return (
    <Nav isOpen={isOpen}>
      <NavList>
        <Logo>
          <span>
            <HiSparkles />
            UTAK
          </span>
        </Logo>
        <NavItem>
          <NavLink to="/">
            <HiMiniChartPie />
            <span>Dashboard</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/inventory" active={true}>
            <HiMiniShoppingBag />
            <span>Inventory</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/">
            <HiMiniCog6Tooth />
            <span>Settings</span>
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
}
