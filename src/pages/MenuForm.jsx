import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiMiniDocumentCheck,
  HiMiniDocumentPlus,
  HiMiniPencilSquare,
  HiMiniPlus,
  HiMiniTrash,
  HiMiniXMark,
} from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import {
  addMenuItem as addMenuItemApi,
  getMenuItem,
  updateMenuItem as updateMenuItemApi,
} from "../services/firebase";
import Button from "../ui/Button";
import { containerStyles } from "../ui/Container";
import SkeletonLoading from "../ui/SkeletonLoading";
import SpinnerMini from "../ui/SpinnerMini";
import Table from "../ui/Table";
import { breakpoints } from "../utils/breakpoints";

const Form = styled.form`
  ${containerStyles}
`;

const FormTitle = styled.h2``;

const FormGroup = styled.div`
  font-size: 1.6rem;
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.columns &&
    css`
      display: grid;
      grid-template-columns: repeat(${props.columns}, 1fr);
      gap: 1.6rem;

      @media (max-width: ${breakpoints.tablet}) {
        grid-template-columns: 1fr;
      }
    `}
`;

const FormLabel = styled.label`
  color: #222132;
  margin-bottom: 0.6rem;
`;

const FormInput = styled.input`
  padding: 1.25rem 2rem;
  outline: none;
  border-radius: 0.5rem;
  border: 2px solid var(--color-gray-secondary);
  transition: var(--ts);

  &:focus {
    border: 2px solid #222132;
  }
`;

const FormTextArea = styled.textarea`
  padding: 1.25rem 2rem;
  outline: none;
  border-radius: 0.5rem;
  border: 2px solid var(--color-gray-secondary);
  min-height: 150px;
  resize: none;
  transition: var(--ts);

  &:focus {
    border: 2px solid #222132;
  }
`;

const FormDivider = styled.hr`
  border: none;
  border-top: 1px solid
    ${(props) => props.color || "var(--color-gray-secondary)"};
  margin: ${(props) => props.margin || "20px 0"};
  width: ${(props) => props.width || "100%"};
`;

const ButtonRight = styled(Button)`
  align-self: end;
`;

const RowButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const EditButton = styled(IconButton)`
  & svg {
    fill: var(--color-primary);
    transition: var(--ts);
  }

  &:disabled {
    cursor: not-allowed;

    & svg {
      opacity: 0;
    }
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: .8;
  }
  50% {
    opacity: .2
  }
  100% {
    opacity: .8;
  } 
`;

const DeleteButton = styled(IconButton)`
  & svg {
    fill: var(--color-danger);
  }
`;

const DataCell = styled.span`
  transition: var(--ts);

  ${(props) =>
    props.active &&
    css`
      color: var(--color-accent-tertiary);
      animation: ${fadeIn} 1s ease-in infinite backwards;
      font-size: 1.6rem;
    `}
`;

const Error = styled.p`
  font-size: 1.4rem;
  color: var(--color-danger);
`;

const initialState = {
  name: "",
  price: "",
  category: "",
  cost: "",
  amountInStock: "",
  description: "",
  currentOption: {
    name: "",
    price: "",
    cost: "",
    amountInStock: "",
  },
};

const StyledButton = styled(Button)`
  width: max-content;
`;

export default function MenuForm() {
  const { id } = useParams();
  const editSession = Boolean(id);
  const {
    isLoading: isMenuItemLoading,
    data: menuItem,
    error: isMenuItemError,
  } = useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => getMenuItem(id),
    enabled: editSession,
  });
  const [formState, setFormState] = useState(initialState);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sortedOptions = options.sort((a, b) => a.createdAt - b.createdAt);
  const isEditingOption = Boolean(formState.currentOption.id);

  useEffect(
    function () {
      if (menuItem) {
        setFormState({
          ...initialState,
          ...menuItem,
        });
      }

      if (menuItem?.options) {
        setOptions(menuItem.options);
      }
    },
    [menuItem]
  );

  const { isPending: isMenuItemAdding, mutate: addMenuItem } = useMutation({
    mutationFn: addMenuItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item successfully added to menu!");
      navigate("/inventory");
    },
    onError: (err) => toast.error(err.message || "Failed to add item to menu."),
  });

  const { isPending: isMenuItemUpdating, mutate: updateMenuItem } = useMutation(
    {
      mutationFn: ({ id, data }) => updateMenuItemApi(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["menuItems"] });
        toast.success("Item successfully updated!!");
        navigate("/inventory");
      },
      onError: (err) => toast.error(err.message || "Failed to update item."),
    }
  );

  function handleInputChange(e) {
    const { name, value, dataset } = e.target;
    const fieldType = dataset.type;

    if (fieldType === "main") {
      setFormState((state) => ({ ...state, [name]: value }));
    } else if (fieldType === "currentOption") {
      setFormState((state) => ({
        ...state,
        currentOption: {
          ...state.currentOption,
          [name]: value,
        },
      }));
    } else {
      toast.error(
        "Oops! Something went wrong. Please try again later or contact support."
      );
    }
  }

  function handleAddOption(e) {
    e.preventDefault();

    const { name, cost, price, amountInStock, createdAt, id } =
      formState.currentOption;

    if (!name || !cost || !price || !amountInStock) {
      toast.error(
        "Please fill out the following required fields for adding an option."
      );
      return;
    }

    if (id) {
      setOptions((prev) => [
        ...prev.filter((option) => option.id !== id),
        {
          name,
          cost: Number(cost),
          price: Number(price),
          amountInStock: Number(amountInStock),
          createdAt,
          id,
        },
      ]);
    } else {
      const createdAt = Date.now();

      setOptions((prev) => [
        ...prev,
        {
          name,
          cost: Number(cost),
          price: Number(price),
          amountInStock: Number(amountInStock),
          id: uuidv4(),
          createdAt,
        },
      ]);
    }

    setFormState((prev) => ({
      ...prev,
      currentOption: {
        name: "",
        price: "",
        cost: "",
        amountInStock: "",
      },
    }));
  }

  function handleEditOption(e, item) {
    e.preventDefault();

    if (isEditingOption) {
      toast.error(
        `Please save your changes for '${formState.currentOption.name}' option before continuing.`
      );
      return;
    }

    setFormState((prev) => ({ ...prev, currentOption: item }));
  }

  function handleDeleteOption(e, item) {
    e.preventDefault();

    if (isEditingOption) {
      toast.error(
        `Please save your changes for '${formState.currentOption.name}' option before continuing.`
      );
      return;
    }

    if (window.confirm("Are you sure?"))
      setOptions((prev) => {
        return prev.filter((option) => option.id !== item.id);
      });
  }

  function validateField(name, value) {
    let errorMsg = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMsg = "Name is required";
        }
        break;
      case "price":
        if (!value) {
          errorMsg = "Price is required";
        } else if (isNaN(value) || value <= 0) {
          errorMsg = "Price must be a valid number greater than 0";
        }
        break;
      case "category":
        if (!value.trim()) {
          errorMsg = "Category is required";
        }
        break;
      case "cost":
        if (!value) {
          errorMsg = "Cost is required";
        } else if (isNaN(value) || value <= 0) {
          errorMsg = "Cost must be a valid number greater than 0";
        }
        break;
      case "amountInStock":
        if (!value) {
          errorMsg = "Amount in stock is required";
        } else if (isNaN(value) || value < 0) {
          errorMsg =
            "Amount in stock must be a valid number and cannot be negative";
        }
        break;
      case "description":
        if (!value.trim()) {
          errorMsg = "Description is required";
        } else if (value.length > 500) {
          errorMsg = "Description must not exceed 500 characters";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    return errorMsg;
  }

  function validateForm() {
    const validationErrors = {};
    Object.keys(formState).forEach((field) => {
      const error = validateField(field, formState[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });
    return validationErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (isEditingOption) {
      toast.error(
        `Please save your changes for '${formState.currentOption.name}' option before continuing.`
      );
      return;
    }

    const { name, price, category, cost, amountInStock, description } =
      formState;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill out all required fields.");
      setErrors(validationErrors);
      return;
    }

    if (!name || !cost || !price || !amountInStock) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const data = {
      name,
      price: Number(price),
      category,
      cost: Number(cost),
      amountInStock: Number(amountInStock),
      description: description,
      options,
    };

    if (editSession) {
      updateMenuItem({ id, data });
      return;
    } else {
      const createdAt = Date.now();
      const newData = { ...data, createdAt };
      addMenuItem(newData);
    }
  }

  function isCurrentOption(item) {
    return formState.currentOption.id === item.id;
  }

  function renderRowButton(item) {
    return (
      <RowButton>
        <EditButton
          onClick={(e) => handleEditOption(e, item)}
          disabled={isCurrentOption(item)}
        >
          <HiMiniPencilSquare />
        </EditButton>
        <DeleteButton onClick={(e) => handleDeleteOption(e, item)}>
          <HiMiniTrash />
        </DeleteButton>
      </RowButton>
    );
  }

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (value, item) => (
        <DataCell active={isCurrentOption(item)}>{value}</DataCell>
      ),
    },
    {
      header: "Price",
      accessor: "price",
      render: (value, item) => (
        <DataCell active={isCurrentOption(item)}>{value}</DataCell>
      ),
    },
    {
      header: "Cost",
      accessor: "cost",
      render: (value, item) => (
        <DataCell active={isCurrentOption(item)}>{value}</DataCell>
      ),
    },
    {
      header: "Stock",
      accessor: "amountInStock",
      render: (value, item) => (
        <DataCell active={isCurrentOption(item)}>{value}</DataCell>
      ),
    },
  ];

  function handleCancel(e) {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate(-1);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <StyledButton onClick={handleCancel} variant="secondary">
        <HiMiniXMark /> <span>Cancel</span>
      </StyledButton>

      <FormTitle>
        Item Details{" "}
        {!isMenuItemLoading && editSession && `(Editing ${menuItem?.name})`}
      </FormTitle>
      <FormGroup>
        <FormLabel htmlFor="name">Name</FormLabel>
        {isMenuItemLoading ? (
          <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
        ) : (
          <FormInput
            id="name"
            name="name"
            type="text"
            data-type="main"
            value={formState.name}
            onChange={handleInputChange}
            // required
          />
        )}

        {errors.name && <Error>{errors.name}</Error>}
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="category">Category</FormLabel>
        {isMenuItemLoading ? (
          <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
        ) : (
          <FormInput
            id="category"
            name="category"
            type="text"
            data-type="main"
            value={formState.category}
            onChange={handleInputChange}
            // required
          />
        )}

        {errors.category && <Error>{errors.category}</Error>}
      </FormGroup>
      <FormGroup columns={2}>
        <FormGroup>
          <FormLabel htmlFor="price">Price</FormLabel>
          {isMenuItemLoading ? (
            <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
          ) : (
            <FormInput
              id="price"
              name="price"
              type="number"
              data-type="main"
              value={formState.price}
              onChange={handleInputChange}
              // required
            />
          )}
          {errors.price && <Error>{errors.price}</Error>}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="cost">Cost</FormLabel>
          {isMenuItemLoading ? (
            <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
          ) : (
            <FormInput
              id="cost"
              name="cost"
              type="number"
              data-type="main"
              value={formState.cost}
              onChange={handleInputChange}
              // required
            />
          )}
          {errors.cost && <Error>{errors.cost}</Error>}
        </FormGroup>
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="amountInStock">Amount In Stock</FormLabel>
        {isMenuItemLoading ? (
          <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
        ) : (
          <FormInput
            id="amountInStock"
            name="amountInStock"
            type="number"
            data-type="main"
            value={formState.amountInStock}
            onChange={handleInputChange}
            // required
          />
        )}
        {errors.amountInStock && <Error>{errors.amountInStock}</Error>}
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="description">Description</FormLabel>
        {isMenuItemLoading ? (
          <SkeletonLoading height="15rem" style={{ width: "100%" }} />
        ) : (
          <FormTextArea
            id="description"
            name="description"
            type="number"
            data-type="main"
            value={formState.description}
            onChange={handleInputChange}
            // required
          />
        )}
        {errors.description && <Error>{errors.description}</Error>}
      </FormGroup>
      <FormDivider />
      <FormTitle>Add Options (Optional)</FormTitle>
      <FormGroup>
        <FormLabel htmlFor="optionName">Variant name</FormLabel>
        {isMenuItemLoading ? (
          <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
        ) : (
          <FormInput
            id="optionName"
            name="name"
            type="text"
            data-type="currentOption"
            value={formState.currentOption.name}
            onChange={handleInputChange}
          />
        )}
      </FormGroup>
      <FormGroup columns={2}>
        <FormGroup>
          <FormLabel htmlFor="optionPrice">Price</FormLabel>
          {isMenuItemLoading ? (
            <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
          ) : (
            <FormInput
              id="optionPrice"
              name="price"
              type="number"
              data-type="currentOption"
              value={formState.currentOption.price}
              onChange={handleInputChange}
            />
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="optionCost">Cost</FormLabel>
          {isMenuItemLoading ? (
            <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
          ) : (
            <FormInput
              id="optionCost"
              name="cost"
              type="number"
              data-type="currentOption"
              value={formState.currentOption.cost}
              onChange={handleInputChange}
            />
          )}
        </FormGroup>
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="optionAmountInStock">Amount In Stock</FormLabel>
        {isMenuItemLoading ? (
          <SkeletonLoading height="5.1rem" style={{ width: "100%" }} />
        ) : (
          <FormInput
            id="optionAmountInStock"
            name="amountInStock"
            type="number"
            data-type="currentOption"
            value={formState.currentOption.amountInStock}
            onChange={handleInputChange}
          />
        )}
      </FormGroup>
      <ButtonRight onClick={handleAddOption} variant="primary">
        {isEditingOption ? (
          <>
            <HiMiniDocumentCheck /> <span>Save changes</span>
          </>
        ) : (
          <>
            <HiMiniPlus /> <span>Add to list</span>
          </>
        )}
      </ButtonRight>
      {Boolean(options.length) && (
        <Table
          columns={columns}
          data={sortedOptions}
          rowButton={renderRowButton}
          message="No options added."
        />
      )}
      {editSession ? (
        <Button type="submit" variant="primary" disabled={isMenuItemUpdating}>
          {isMenuItemUpdating ? (
            <SpinnerMini />
          ) : (
            <>
              <HiMiniDocumentCheck /> <span>Save</span>
            </>
          )}
        </Button>
      ) : (
        <Button type="submit" variant="primary" disabled={isMenuItemAdding}>
          {isMenuItemAdding ? (
            <SpinnerMini />
          ) : (
            <>
              <HiMiniDocumentPlus /> <span>Submit</span>
            </>
          )}
        </Button>
      )}
    </Form>
  );
}
