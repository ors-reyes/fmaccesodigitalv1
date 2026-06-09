import{ useEffect, useState } from "react";
import { MdDarkMode, MdLightMode  } from "react-icons/md";
const themeSizeIcon = 25
function getInitialTheme() {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
  }
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
    } catch (e) {console.error(e)}
    if (window.matchMedia) return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // MutationObserver to keep state in sync with inline script or other code that sets data-theme
    let observer;
    if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
            const newTheme = document.documentElement.getAttribute("data-theme");
            if (newTheme) setTheme(newTheme);
          }
        }
      });
      observer.observe(document.documentElement, { attributes: true });
    }

    // Fallback: listen to system preference changes if inline script doesn't handle it
    const darkQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    function onSystemChange(e) {
      if (!localStorage.getItem("theme")) {
        const sys = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", sys);
        setTheme(sys);
      }
    }
    if (darkQuery) {
      if (darkQuery.addEventListener) darkQuery.addEventListener("change", onSystemChange);
      else if (darkQuery.addListener) darkQuery.addListener(onSystemChange);
    }

    return () => {
      if (observer) observer.disconnect();
      if (darkQuery) {
        if (darkQuery.removeEventListener) darkQuery.removeEventListener("change", onSystemChange);
        else if (darkQuery.removeListener) darkQuery.removeListener(onSystemChange);
      }
    };
  }, []);

  function handleSetTheme(newTheme) {
    if (typeof window !== "undefined" && typeof window.__setUserTheme === "function") {
      window.__setUserTheme(newTheme);
    } else {
      try { localStorage.setItem("theme", newTheme); } catch (e) {console.error(e)}
      if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", newTheme);
      setTheme(newTheme);
    }
  }

  return (
    <>
      <div className="mode">
        <button className="btnDarkMode" onClick={() => handleSetTheme("dark")} aria-label="Activar modo oscuro"><MdDarkMode size={themeSizeIcon} /></button>
        <button className="btnLightMode" onClick={() => handleSetTheme("light")} aria-label="Activar modo claro"><MdLightMode size={themeSizeIcon} /></button>
      </div>        
    </>
  );
}
