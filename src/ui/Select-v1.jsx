import styled, { css } from "styled-components";

const StyledSelect = styled.select`
  font: inherit;
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-gray-secondary);
  border-radius: 0.6rem;
  background-color: var(--color-white);
  font-weight: 500;
  box-shadow: var(--box-shadow-1);
`;

function Select({ options, value, onChange, ...props }) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
