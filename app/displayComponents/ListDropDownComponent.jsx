import React, { useState } from "react";

const ListDropDownComponent = ({ defaultValue, options, onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onOptionSelect(selectedValue);
  };

  return (
    <div>
      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedOption}
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
