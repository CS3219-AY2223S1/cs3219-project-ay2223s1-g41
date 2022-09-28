import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

import { Switch } from "@headlessui/react";
import { THEME } from "../utils/constants";
import { useTheme } from "next-themes";

export default function ToggleDarkMode() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) return null;

  return (
    <Switch
      checked={theme === THEME.DARK}
      onChange={() => {
        setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);
      }}
      className="relative inline-flex w-16 h-8 transition-colors duration-200 ease-in-out bg-green-100 border-4 border-transparent rounded-full cursor-pointer dark:bg-green-800 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className="inline-block w-6 h-6 transition duration-200 ease-in-out translate-x-0 bg-green-800 rounded-full pointer-events-none dark:translate-x-8 dark:bg-green-100"
      />
      <MoonIcon className="absolute hidden w-5 h-5 text-green-100 -translate-y-1/2 top-1/2 dark:block translate-x-1/4" />
      <SunIcon className="absolute w-5 h-5 text-green-800 translate-x-8 -translate-y-1/2 dark:hidden top-1/2" />
    </Switch>
  );
}
