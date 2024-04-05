"use client";
import React, { useState } from "react";

const ListDropDownComponent = ({ defaultValue, currentValue, options, onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onOptionSelect(selectedValue);
  };

  console.log("ListDropDownComponent: SelectedOption: ", selectedOption);

  return (
    <div>
      <select
        name="dropdownList"
        className="select select-bordered w-full max-w-xs"
        value={currentValue}
        onChange={handleOptionChange}
      >
        <option disabled>{defaultValue}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ListDropDownComponent;
