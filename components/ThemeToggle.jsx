"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState } from "react";

const themes = {
  dark: "dim",
  light: "nord",
};

function ThemeToggle() {
  const [theme, setTheme] = useState(themes.light);

  const toggleTheme = () => {
    const newTheme = theme === themes.dark ? themes.light : themes.dark;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "dark" ? (
        <BsMoonFill className="h-4 w-4 " />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
}
export default ThemeToggle;
