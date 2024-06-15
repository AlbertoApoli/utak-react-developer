import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { HiMiniPlus } from "react-icons/hi2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  deleteMenuItem as deleteMenuItemApi,
  getMenuItems,
} from "../services/firebase";
import { formatNumber, transformFirebaseData } from "../utils/utils";
import Dropdown from "./Dropdown";
import MenuTableOperations from "./MenuTableOperations";
import Table from "./Table";
import TablePagination from "./TablePagination";
import { buttonStyles } from "./Button";
import { breakpoints } from "../utils/breakpoints";

const TableWrapper = styled.div`
  border-radius: 2.4rem;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow-1);
`;

const TableHeaderContainer = styled.div`
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: start;
  }
`;

const TableHeaderBox = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: end;
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: initial;
    align-items: initial;
    width: 100%;
  }
`;

const TablePaginationContainer = styled.div`
  padding: 3rem;
`;

const TableLabel = styled.h2``;

const StyledLink = styled(Link)`
  ${buttonStyles}
`;

const OptionDelete = styled.button`
  width: 100%;
  font-weight: 500;
  padding: 0.8rem 1.6rem;
  text-align: left;
  color: var(--color-danger);

  &:hover {
    background-color: var(--color-danger);
    color: var(--color-white);
  }
`;

const LinkColumn = styled(Link)`
  color: var(--color-primary);
  font-weight: 600;
  transition: var(--ts);

  &:hover {
    color: var(--color-primary-dark);
  }
`;

export default function MenuTable() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  let currentPage = searchParams.get("pageNumber") || 1;
  let pageSize = 5;
  let startIndex = (currentPage - 1) * pageSize;
  let endIndex = startIndex + pageSize;

  const {
    isLoading: isMenuItemsLoading,
    data: menuItems,
    error: isMenuItemsError,
  } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });

  const { isPending: isMenuItemDeleting, mutate: deleteMenuItem } = useMutation(
    {
      mutationFn: deleteMenuItemApi,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["menuItems"] });
        toast.success("Item successfully deleted!");
      },
      onError: (err) => toast.error(err.message || "Failed to delete item."),
    }
  );

  const transformedMenuItems = transformFirebaseData(menuItems);

  console.log(transformedMenuItems);

  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  function compareText(a, b) {
    if (a[field].toLowerCase() < b[field].toLowerCase()) {
      return -1 * modifier;
    }
    if (a[field].toLowerCase() > b[field].toLowerCase()) {
      return 1 * modifier;
    }
    return 0;
  }

  function compareNumbers(a, b) {
    return (a[field] - b[field]) * modifier;
  }

  const sortedMenuItems =
    typeof transformedMenuItems?.at(0)?.[field] === "string"
      ? transformedMenuItems.sort(compareText)
      : transformedMenuItems.sort(compareNumbers);

  let currentPageMenuItems = sortedMenuItems.slice(startIndex, endIndex);

  function handleDeleteMenuItem(id) {
    if (window.confirm("Are you sure?")) {
      deleteMenuItem(id);
    }
  }

  function renderRowButton(item) {
    return (
      <Dropdown
        text="Actions"
        items={[
          {
            text: "Details",
            onClick: () => navigate(`/inventory/${item.id}`),
          },
          {
            text: "Edit",
            onClick: () => navigate(`/inventory/edit/${item.id}`),
          },
          {
            text: "Delete",
            onClick: () => handleDeleteMenuItem(item.id),
            render: () => (
              <OptionDelete
                onClick={() => handleDeleteMenuItem(item.id)}
                disabled={isMenuItemDeleting}
              >
                Delete
              </OptionDelete>
            ),
          },
        ]}
      />
    );
  }

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (value, item) => (
        <LinkColumn to={`/inventory/${item.id}`}>{value}</LinkColumn>
      ),
    },
    {
      header: "Category",
      accessor: "category",
    },
    {
      header: "Price",
      accessor: "price",
      render: (value) => formatNumber(value, 2, true),
    },
    {
      header: "Cost",
      accessor: "cost",
      render: (value) => formatNumber(value, 2, true),
    },
    {
      header: "Stock",
      accessor: "amountInStock",
      render: (value) => formatNumber(value, 0),
    },
  ];

  return (
    <>
      <TableWrapper>
        <TableHeaderContainer>
          <TableLabel>Menu Items</TableLabel>
          <TableHeaderBox>
            <MenuTableOperations />
            <StyledLink to="/inventory/add" variant="primary">
              <HiMiniPlus /> <span>Add Item</span>
            </StyledLink>
          </TableHeaderBox>
        </TableHeaderContainer>
        <Table
          columns={columns}
          data={currentPageMenuItems}
          rowButton={renderRowButton}
          isLoading={isMenuItemsLoading}
        />
        <TablePaginationContainer>
          <TablePagination
            maxPage={transformedMenuItems.length / pageSize}
            isLoading={isMenuItemsLoading}
          />
        </TablePaginationContainer>
      </TableWrapper>
    </>
  );
}
