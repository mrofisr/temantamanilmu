import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/dist/client/link";

const isDark = () =>
  (localStorage && localStorage.theme === "dark") ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);
const getThemeString = (isDark) => (isDark ? "dark" : "light");

const links = [
  {
    name: "Home",
    href: "/",
    hideOnMobile: true,
  },
  {
    name: "Tags",
    href: "/tags",
    hideOnMobile: true,
  },
  {
    name: "Blog",
    href: "/blog",
  },
];
export {};

export default function Navbar() {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleMode = () => {
    localStorage.theme = getThemeString(!isDarkMode);
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkMode(!isDarkMode);
  };
  const darkModeActive =
    process.browser && document.documentElement.classList.contains("dark");
  useEffect(() => {
    setDarkMode(isDark());
  }, []);
  return (
    <div
      className="
    w-full fixed bg-white flex flex-row justify-between items-center
    h-16 md:h-20 border-b-2 border-gray-200 z-50
    px-8 sm:px-16 md:px-36 lg:px-52 xl:px-80 2xl:px-96
    dark:bg-gray-800 dark:border-gray-600
    text-black dark:text-white"
    >
      <Link href="/">
        <img
          src="/static/images/lighthouse.png"
          alt="logo"
          className="h-8 sm:h-12"
        />
      </Link>
      <div className="flex flex-row items-center">
        <nav>
          {links.map(({ name, href, hideOnMobile = false }) => (
            <Link key={name} href={href}>
              <p
                className={`mr-6 sm:mr-8 hover:bg-yellow-400 px-2 py-1 rounded-md ${
                  hideOnMobile ? "hidden" : "inline"
                } sm:inline`}
              >
                {name}
              </p>
            </Link>
          ))}
        </nav>
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.button
            className="text-2xl text-yellow-400 dark:text-yellow-300 focus:outline-none"
            onClick={() => toggleMode()}
            key={darkModeActive ? "dark-icon" : "light-icon"}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {darkModeActive ? "☀️" : "🌑"}
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
}
