import { useEffect, useState } from "react";
import styled from "styled-components";
import SkeletonLoading from "./SkeletonLoading";
import { breakpoints } from "../utils/breakpoints";
// import Alert from "./Alert";

const TableWrapper = styled.div`
  @media (max-width: ${breakpoints.desktop}) {
    overflow-x: auto;
    width: 100%;
  }
`;

const StyledTable = styled.table`
  table-layout: auto;
  min-width: 100%;
  width: 100%;
  border-collapse: collapse;

  @media (max-width: ${breakpoints.desktop}) {
    margin-bottom: 11rem;
  }
`;

const TableHead = styled.th`
  font-size: 1.4rem;
  font-weight: 600;
  padding: 1.6rem 3rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
`;

const TableBody = styled.tbody`
  & > * {
    border-top: 1px solid #e5e7eb;
  }
`;

const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: var(--color-gray-primary);
  }
`;

const TableData = styled.td`
  max-width: 1rem;
  padding: 1.6rem 3rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.4rem;
  font-weight: 500;

  &:not(:last-child) {
    overflow: hidden;
  }

  @media (max-width: ${breakpoints.tablet}) {
    max-width: initial;
  }
`;

export default function Table({ columns, data, rowButton, isLoading = false }) {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallerDevice(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (isLoading)
    return (
      <div>
        <SkeletonLoading height="4.5rem" />
        <SkeletonLoading height="4.5rem" />
        <SkeletonLoading height="4.5rem" />
        <SkeletonLoading height="4.5rem" />
        <SkeletonLoading height="4.5rem" />
      </div>
    );

  return (
    <TableWrapper>
      <StyledTable className="divide-y divide-gray-200">
        {!isSmallerDevice && (
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHead key={column.header} scope="col">
                  {column.header}
                </TableHead>
              ))}
            </tr>
          </thead>
        )}

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableData
                  key={column.accessor}
                  className=""
                  style={{
                    display: isSmallerDevice ? "block" : "table-cell",
                  }}
                >
                  {isSmallerDevice && (
                    <span className="text-sm font-semibold text-gray-800">
                      {column.header}:{" "}
                    </span>
                  )}

                  {column.render
                    ? column.render(item[column.accessor], item)
                    : item[column.accessor]}
                </TableData>
              ))}
              {rowButton && (
                <TableData
                  style={{
                    display: isSmallerDevice ? "flex" : "table-cell",
                    justifyContent: "right",
                  }}
                >
                  {rowButton(item)}
                </TableData>
              )}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableWrapper>
  );
}
