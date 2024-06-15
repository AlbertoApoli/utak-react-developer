import {
  HiCheckCircle,
  HiInformationCircle,
  HiMiniXCircle,
} from "react-icons/hi2";
import styled, { css } from "styled-components";

const StyledAlert = styled.div`
  padding: 1.6rem;
  border-radius: 0.6rem;
  margin: 2rem 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;

  ${(props) =>
    props.type === "info" &&
    css`
      color: #eff6ff;
      background-color: #1e40af;
    `}

  ${(props) =>
    props.type === "success" &&
    css`
      color: #f0fdf4;
      background-color: #166534;
    `}

    ${(props) =>
    props.type === "error" &&
    css`
      color: #fef2f2;
      background-color: #991b1b;
    `}
`;

function Alert({ type = "success", children }) {
  let styles = "";

  if (type === "success") {
    styles = "bg-green-50 text-green-800";
  } else if (type === "error") {
    styles = "bg-red-50 text-red-800";
  } else {
    styles = "bg-blue-50 text-blue-800";
  }

  return (
    <StyledAlert type={type}>
      {type === "success" && (
        <HiCheckCircle className="flex-shrink-0 text-green-400 mr-4" />
      )}

      {type === "error" && (
        <HiMiniXCircle className="flex-shrink-0 text-red-400 mr-4" />
      )}

      {type === "info" && (
        <HiInformationCircle className="flex-shrink-0 text-blue-400 mr-4" />
      )}

      <span className="">{children}</span>
    </StyledAlert>
  );
}

export default Alert;
