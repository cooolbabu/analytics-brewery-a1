/**
 * This is the documentation for the ListComponent in React.
 * MyComponent renders a greeting message to the user.
 *
 * @defaultValue - The default value to display in the dropdown
 * @optionsList - The list of options to display in the dropdown
 * @onOptionSelect - The function to call when an option is selected
 * return (
 *  <ListDropdownComponent_v1 modelslist={modelslist} firstName={firstName} tokensAvailable={tokensAvailable} />
 * )
 *
 * @param {string} defaultValue - The list of models available to the user
 * @param {object} optionsList - The first name of the user
 * @param {function onOptionSelect(handleOptionSelect) }
 * @returns {ListDropdownComponent_v1} - The dropdown component
 */

import React, { useState } from "react";

const ListDropdownComponent_v1 = ({
  defaultValue,
  options,
  onOptionSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option) => {
    toggleDropdown();
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option);
  };

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={() => selectOption(option)}
    >
      <option disabled selected>
        {defaultValue}
      </option>
      {options.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  );
};

export default ListDropdownComponent_v1;
