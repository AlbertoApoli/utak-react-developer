import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { HiMiniArrowLeft } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { getMenuItem } from "../services/firebase";
import Button from "../ui/Button";
import Container from "../ui/Container";
import SkeletonLoading from "../ui/SkeletonLoading";
import { formatNumber } from "../utils/utils";

const MainDetails = styled.div`
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

const Name = styled.h2`
  font-size: 2.4rem;
`;

const Category = styled.p`
  color: var(--color-primary);
  font-weight: 500;
`;

const Price = styled.h2`
  font-size: 2.4rem;
`;

const DetailGroup = styled.div`
  & span {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: inline-block;
  }
`;

const DetailParagraph = styled.p``;

const DetailText = styled.p``;

const VariantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Variant = styled.button`
  text-transform: capitalize;
  font-size: 1.4rem;
  font-weight: 600;
  padding: 1rem 2.6rem;
  border: 1px solid var(--color-gray-secondary);
  background-color: var(--color-gray-secondary);
  color: var(--color-accent-tertiary);
  border-radius: 50rem;
  transition: var(--ts);

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-primary);
      color: var(--color-white);
      border: 1px solid transparent;
    `}

  &:hover {
    background-color: var(--color-primary-light);
    color: var(--color-white);
    border: 1px solid transparent;
  }
`;

const StyledButton = styled(Button)`
  width: max-content;
`;

export default function MenuDetails() {
  const { id } = useParams();
  const [currentVariant, setCurrentVariant] = useState("standard");
  const navigate = useNavigate();

  const {
    isLoading: isMenuItemLoading,
    data: menuItem,
    error: isMenuItemError,
  } = useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => getMenuItem(id),
  });

  const hasOptions = menuItem?.options;
  const displayVariant =
    menuItem?.options
      ?.filter((option) => option.name.toLowerCase() === currentVariant)
      .at(0) || menuItem;

  function handleVariant(name) {
    setCurrentVariant(name.toLowerCase());
  }

  function isCurrent(name) {
    return currentVariant.toLowerCase() === name.toLowerCase();
  }

  function handleBack() {
    navigate(-1);
  }

  return (
    <Container>
      <StyledButton onClick={handleBack} variant="secondary">
        <HiMiniArrowLeft /> <span>Back</span>
      </StyledButton>

      <MainDetails>
        {isMenuItemLoading ? (
          <SkeletonLoading height="6rem" />
        ) : (
          <>
            <div>
              <Name>{menuItem?.name}</Name>

              <Category>{menuItem?.category}</Category>
            </div>

            <Price>{formatNumber(displayVariant?.price, 2, true)}</Price>
          </>
        )}
      </MainDetails>

      <DetailGroup>
        <span>Description</span>
        {isMenuItemLoading ? (
          <>
            <SkeletonLoading />
            <SkeletonLoading />
            <SkeletonLoading />
            <SkeletonLoading />
            <SkeletonLoading />
          </>
        ) : (
          <DetailParagraph>{menuItem?.description}</DetailParagraph>
        )}
      </DetailGroup>

      <DetailGroup>
        <span>Cost</span>
        {isMenuItemLoading ? (
          <SkeletonLoading style={{ width: "100%" }} />
        ) : (
          <DetailText>{formatNumber(displayVariant?.cost, 2, true)}</DetailText>
        )}
      </DetailGroup>

      <DetailGroup>
        <span>Stock</span>
        {isMenuItemLoading ? (
          <SkeletonLoading style={{ width: "100%" }} />
        ) : (
          <DetailText>
            {formatNumber(displayVariant?.amountInStock, 0)}
          </DetailText>
        )}
      </DetailGroup>

      <DetailGroup>
        <span>Variant{hasOptions && "s"}</span>
        {isMenuItemLoading ? (
          <SkeletonLoading height="4.3rem" />
        ) : (
          <VariantRow>
            <Variant
              onClick={() => handleVariant("standard")}
              active={isCurrent("standard")}
            >
              Standard
            </Variant>
            {hasOptions &&
              menuItem.options.map((option) => (
                <Variant
                  key={option.name}
                  onClick={() => handleVariant(option.name)}
                  active={isCurrent(option.name)}
                >
                  {option.name}
                </Variant>
              ))}
          </VariantRow>
        )}
      </DetailGroup>
    </Container>
  );
}
