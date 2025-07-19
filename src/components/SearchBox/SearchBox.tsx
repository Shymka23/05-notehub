import React from "react";

export interface SearchBoxProps {
  onSearch: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Пошук нотаток..."
      value={value}
      onChange={handleChange}
      style={{
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        minWidth: 200,
      }}
    />
  );
};

export default SearchBox;
