"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState } from "react";

const themes = {
  dark: "dim",
  light: "cymk",
};

function ThemeToggle() {
  const [theme, setTheme] = useState(themes.cymk);

  const toggleTheme = () => {
    const newTheme = theme === themes.light ? themes.dark : themes.light;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    console.log("Theme changed to", newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "cymk" ? <BsMoonFill className="h-4 w-4 " /> : <BsSunFill className="h-4 w-4" />}
    </button>
  );
}
export default ThemeToggle;
