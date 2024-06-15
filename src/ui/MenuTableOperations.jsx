import SortBy from "./SortBy";

export default function MenuTableOperations() {
  return (
    <div>
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "category-asc", label: "Sort by category (A-Z)" },
          { value: "category-desc", label: "Sort by category (Z-A)" },
          { value: "price-asc", label: "Sort by price (low first)" },
          { value: "price-desc", label: "Sort by price (high first)" },
          { value: "cost-asc", label: "Sort by cost (low first)" },
          { value: "cost-desc", label: "Sort by cost (high first)" },
          { value: "amountInStock-asc", label: "Sort by stock (low first)" },
          { value: "amountInStock-desc", label: "Sort by stock (high first)" },
          {
            value: "createdAt-asc",
            label: "Sort by creation date (oldest)",
          },
          {
            value: "createdAt-desc",
            label: "Sort by creation date (newest)",
          },
        ]}
      />
    </div>
  );
}
