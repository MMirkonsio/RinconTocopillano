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
    <div className="flex justify-left items-center dark:bg-rincon relative">
      <button
        className="px-4 py-2 rounded dark:bg-rincon dark:text-gray-100 "
        onClick={handleChangeTheme}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
}

export default Darkmode;
