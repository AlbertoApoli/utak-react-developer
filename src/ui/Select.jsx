import { useState, useLayoutEffect, useRef } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import styled, { css } from "styled-components";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

const SelectContainer = styled.div`
  display: inline-block;
`;

const StyledSelect = styled.button`
  width: 29rem;
  color: #1f2937;
  font-weight: 600;
  border: 1px solid var(--color-gray-secondary);
  background-color: var(--color-white);
  border-radius: 0.5rem;
  outline: none;
  padding: 1rem 2rem;
  white-space: nowrap;
  overflow: hidden;
  transition: var(--ts);
  position: relative;
  text-align: left;

  &:focus {
    border: 1px solid #222132;
  }
`;

const SelectedOption = styled.span``;

const StyledFaChevronDown = styled(FaChevronDown)`
  width: 1.4rem;
  height: 1.4rem;
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledOptions = styled.div`
  width: 29rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-secondary);
  border-radius: 0.6rem;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow: hidden;
`;

const Option = styled.button`
  font-weight: 500;
  padding: 0.8rem 1.6rem;
  white-space: nowrap;
  color: var(--color-accent-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  transition: var(--ts);

  ${(props) =>
    props.active &&
    css`
      order: -1;
      background-color: var(--color-primary-light);
      color: var(--color-white);
    `}

  &:hover:not(:disabled) {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
`;

const StyledFaCheck = styled(FaCheck)`
  width: 1.4rem;
  height: 1.4rem;
`;

function Select({ options, selectedOption, onClick }) {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const ref = useOutsideClick(close, false);
  const selectRef = useRef(null);

  function toggle() {
    setOptionsVisible((visible) => !visible);
  }

  function close() {
    setOptionsVisible(false);
  }

  return (
    <SelectContainer ref={ref}>
      <StyledSelect onClick={toggle} ref={selectRef}>
        <SelectedOption>{selectedOption.label}</SelectedOption>
        <StyledFaChevronDown />
      </StyledSelect>
      {optionsVisible &&
        createPortal(
          <Options
            options={options}
            selectedOption={selectedOption}
            onClick={onClick}
            close={close}
            targetRef={selectRef}
          />,
          document.body
        )}
    </SelectContainer>
  );
}

function Options({ options, selectedOption, onClick, close, targetRef }) {
  const [layout, setLayout] = useState({
    style: {
      top: 0,
      left: 0,
    },
  });

  useLayoutEffect(
    function () {
      const targetRect = targetRef.current.getBoundingClientRect();
      const { width, height, top, left } = targetRect;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const topRelativeToDocument = top + scrollTop;

      setLayout({
        style: {
          top: topRelativeToDocument + height + 5,
          left: left,
        },
      });
    },
    [targetRef]
  );

  return (
    <StyledOptions style={layout.style}>
      {options.map((option) => (
        <Option
          key={option.value}
          active={selectedOption.value === option.value}
          onClick={() => {
            onClick(option);
            close();
          }}
        >
          <span>{option.label}</span>
          {selectedOption.value === option.value && <StyledFaCheck />}
        </Option>
      ))}
    </StyledOptions>
  );
}

export default Select;
