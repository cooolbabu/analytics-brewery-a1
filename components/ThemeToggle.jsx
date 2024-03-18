"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState } from "react";

const themes = {
  dim: "dim",
  nord: "nord",
};

function ThemeToggle() {
  const [theme, setTheme] = useState(themes.nord);

  const toggleTheme = () => {
    const newTheme = theme === themes.dim ? themes.nord : themes.dim;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "dim" ? (
        <BsMoonFill className="h-4 w-4 " />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
}
export default ThemeToggle;
