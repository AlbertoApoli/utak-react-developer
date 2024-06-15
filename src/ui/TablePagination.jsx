import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import SkeletonLoading from "./SkeletonLoading";

const StyledTablePagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaginationCount = styled.p`
  & span {
    font-weight: 600;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 1.2rem;
`;

const Button = styled.button`
  border-radius: 0.6rem;
  font-weight: 600;
  padding: 0.8rem 1.6rem;
  color: #1f2937;
  border: 1px solid var(--color-gray-secondary);
  transition: var(--ts);

  &:hover {
    background-color: #f3f4f6;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-gray-secondary);
    color: #6b7280;
  }
`;

export default function TablePagination({
  maxPage = 10,
  defaultPageNumber = 1,
  isLoading = false,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get("pageNumber") || defaultPageNumber;
  const isFirstPage = Number(pageNumber) <= 1;
  const isLastPage = Number(pageNumber) >= maxPage;
  const displayMaxPage = Math.ceil(maxPage);

  function handlePrevClick() {
    if (isFirstPage) return;
    searchParams.set("pageNumber", Number(pageNumber) - 1);
    setSearchParams(searchParams);
  }

  function handleNextClick() {
    if (isLastPage) return;
    searchParams.set("pageNumber", Number(pageNumber) + 1);
    setSearchParams(searchParams);
  }

  return (
    <StyledTablePagination>
      <PaginationCount>
        {!isLoading && (
          <>
            Showing Page <span>{pageNumber}</span> of{" "}
            <span>{displayMaxPage}</span>
          </>
        )}
      </PaginationCount>
      <ButtonsContainer>
        <Button onClick={handlePrevClick} disabled={isFirstPage}>
          Previous
        </Button>
        <Button onClick={handleNextClick} disabled={isLastPage}>
          Next
        </Button>
      </ButtonsContainer>
    </StyledTablePagination>
  );
}
