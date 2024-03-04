import { useEffect, useState } from "react";
import { Moon, Sun } from "feather-icons-react";

function Darkmode() {
  const storedTheme = localStorage.getItem("color-theme");
  const [theme, setTheme] = useState(storedTheme || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  }, [theme]);

  const handleChangeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("color-theme", newTheme);
  };

  return (
    <div className="flex justify-left items-center dark:bg-gray-900 relative -top-2">
      <button
        className="px-4 py-2 rounded dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
        onClick={handleChangeTheme}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}

export default Darkmode;
