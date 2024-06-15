import styled from "styled-components";
import Card from "./Card";
import {
  HiMiniCube,
  HiMiniCurrencyDollar,
  HiShoppingCart,
} from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "../services/firebase";
import { formatNumber } from "../utils/utils";

const StyledMetrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3.9rem;

  & > * {
    flex: 1;
  }
`;

export default function Metrics() {
  const {
    isLoading: isMetricsLoading,
    data: metrics,
    error: isMetricsError,
  } = useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
  });

  const { totalRevenue, totalCost, totalOrders } = metrics || {};

  return (
    <StyledMetrics>
      <Card
        value={formatNumber(totalRevenue, 2, true)}
        label="Total Revenue"
        icon={HiMiniCurrencyDollar}
        delay={0.1}
        isLoading={isMetricsLoading}
      />
      <Card
        value={formatNumber(totalOrders, 0)}
        label="Total Number of Orders"
        icon={HiShoppingCart}
        delay={0.2}
        isLoading={isMetricsLoading}
      />
      <Card
        value={formatNumber(totalRevenue / totalOrders, 2, true)}
        label="Average Order Value"
        icon={HiMiniCube}
        delay={0.3}
        isLoading={isMetricsLoading}
      />
      <Card
        value={formatNumber(totalRevenue - totalCost, 2, true)}
        label="Total Profit"
        icon={HiMiniCurrencyDollar}
        delay={0.4}
        isLoading={isMetricsLoading}
      />
    </StyledMetrics>
  );
}
