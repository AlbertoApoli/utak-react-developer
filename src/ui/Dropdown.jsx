import { useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { HiMiniChevronDown } from "react-icons/hi2";
import styled from "styled-components";

const StyledDropdown = styled.div`
  position: relative;
  width: min-content;
`;

const Select = styled.button`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-accent-primary);
`;

const Options = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.8rem;
  width: 19.2rem;
  background-color: var(--color-white);
  border-radius: 0.6rem;
  box-shadow: var(--box-shadow-1);
  transition: var(--ts);
  overflow: hidden;
  border: 1px solid var(--color-gray-secondary);
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const Option = styled.button`
  width: 100%;
  font-weight: 500;
  padding: 0.8rem 1.6rem;
  text-align: left;
  color: var(--color-accent-primary);
  transition: var(--ts);

  &:hover {
    background-color: var(--color-primary-light);
    color: var(--color-white);
  }
`;

export default function Dropdown({ text, items }) {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  function close() {
    setShowDropdown(false);
  }

  const ref = useOutsideClick(close);

  return (
    <StyledDropdown className="relative" ref={ref} onClick={toggleDropdown}>
      <Select>
        <span>{text}</span>
        <HiMiniChevronDown />
      </Select>
      {showDropdown && (
        <Options>
          {items.map((item, index) =>
            item.render ? (
              item.render()
            ) : (
              <Option key={index} onClick={item.onClick}>
                {item.text}
              </Option>
            )
          )}
        </Options>
      )}
    </StyledDropdown>
  );
}
