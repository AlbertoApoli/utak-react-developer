import styled from "styled-components";
import Metrics from "../ui/Metrics";
import MenuTable from "../ui/MenuTable";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 147.7rem;
  margin: 0 auto;
`;

export default function MenuItems() {
  return (
    <Page>
      <Metrics />
      <MenuTable />
    </Page>
  );
}
