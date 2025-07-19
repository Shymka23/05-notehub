import React, { useState } from "react";
import css from "./SearchBar.module.css";

export interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles input change by updating the local state and calling the onSearch callback.
   * @param e - The input change event.
   */
  /*******  c3efa818-7215-46b7-9d18-8add092e120e  *******/ const handleChange =
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onSearch(e.target.value);
    };

  return (
    <input
      className={css.input}
      type="text"
      name="search"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
      autoComplete="off"
    />
  );
};

export default SearchBar;
