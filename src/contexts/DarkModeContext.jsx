import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "./../hooks/useLocalStorageState";

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "isDarkMode"
  );

  function toggleDarkMode() {
    setIsDarkMode((isDark) => !isDark);

    // if (isDarkMode) {
    //   document.querySelector("html").classList.add("light-mode");
    //   document.querySelector("html").classList.remove("dark-mode");
    // } else {
    //   document.querySelector("html").classList.add("dark-mode");
    //   document.querySelector("html").classList.remove("light-mode");
    // }
  }

  useEffect(
    function () {
      if (isDarkMode) {
        document.querySelector("html").classList.add("dark-mode");
        document.querySelector("html").classList.remove("light-mode");
      } else {
        document.querySelector("html").classList.add("light-mode");
        document.querySelector("html").classList.remove("dark-mode");
      }
    },
    [isDarkMode]
  );

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkModeProvider");

  return context;
}

export { DarkModeProvider, useDarkMode };
