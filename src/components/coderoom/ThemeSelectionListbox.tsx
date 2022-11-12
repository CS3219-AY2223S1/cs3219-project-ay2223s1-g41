import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { Dispatch, SetStateAction, useState, useEffect, Fragment } from "react";

const THEME = [{ theme: "light" }, { theme: "vs-dark" }];

export default function ThemeSelectionListbox({ setCurrentTheme }: { setCurrentTheme: Dispatch<SetStateAction<string>> }) {
    const [selected, setSelected] = useState(THEME[1]);

    useEffect(() => {
        setCurrentTheme(selected.theme);
    }, [selected]);

    return (
        <div className="z-20">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-30 h-max rounded-lg bg-light-100 text-center dark:bg-dark-200 shadow-2xl py-2 pl-3 pr-10 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{selected.theme}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path
                                    fillRule="evenodd"
                                    d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute mt-1 max-h-60 w-max overflow-auto rounded-md bg-light-100 dark:bg-dark-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {THEME.map((theme, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? "bg-green-200 text-dark-200" : "text-dark-200 dark:text-light-100"
                                        }`
                                    }
                                    value={theme}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{theme.theme}</span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active ? "text-dark-200" : "text-green-200"
                                                    }`}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
