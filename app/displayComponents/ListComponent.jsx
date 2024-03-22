/**
 * This is the documentation for the ListComponent in React.
 * MyComponent renders a greeting message to the user.
 *
 * @defaultValue - The default value to display in the dropdown
 * @optionsList - The list of options to display in the dropdown
 * @onOptionSelect - The function to call when an option is selected
 * return (
 *  <ListDropdownComponent modelslist={modelslist} firstName={firstName} tokensAvailable={tokensAvailable} />
 * )
 *
 * @param {string} defaultValue - The list of models available to the user
 * @param {object} optionsList - The first name of the user
 * @param {function onOptionSelect(handleOptionSelect) }
 * @returns {ListDropdownComponent} - The dropdown component
 */

import React, { useState } from "react";

const ListDropdownComponent = ({ defaultValue, options, onOptionSelect }) => {
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
    <div className="dropdown dropdown-hover rounded-xl">
      <div tabIndex={0} role="button" className="btn m-1 rounded-2xl">
        {selectedOption}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-52"
      >
        {options.map((option, index) => (
          <li
            className="p-2 hover:bg-slate-300"
            key={index}
            onClick={() => selectOption(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListDropdownComponent;
