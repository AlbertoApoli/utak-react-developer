import { useSearchParams } from "react-router-dom";
import Select from "./Select";
import { useState } from "react";

export default function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === sortBy) || options.at(11)
  );

  function handleOptionClick(option) {
    setSelectedOption(option);
    searchParams.set("sortBy", option.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      selectedOption={selectedOption}
      onClick={handleOptionClick}
    ></Select>
  );
}
