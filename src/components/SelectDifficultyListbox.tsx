import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, Fragment, useEffect } from "react";
import { DIFFICULTY } from "../utils/constants";

export default function SelectDifficultyListbox({
    selectedDifficulty,
    setSelectedDifficulty,
}: {
    selectedDifficulty: Array<{ id: number; difficulty: string }>;
    setSelectedDifficulty: Dispatch<SetStateAction<Array<{ id: number; difficulty: string }>>>;
}) {
    return (
        <div>
            <Listbox value={selectedDifficulty.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))} onChange={setSelectedDifficulty} multiple>
                <Listbox.Button className="relative w-60 h-max cursor-pointer rounded-lg bg-white dark:bg-dark-100 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="truncate flex justify-center items-center gap-4 dark:text-white text-black">
                        {selectedDifficulty.length === 0 && <p className="font-bold">Select difficulty</p>}
                        {selectedDifficulty.map((d) => d.difficulty).join(", ")}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 dark:fill-white fill-black">
                            <path
                                fillRule="evenodd"
                                d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="fixed overflow-auto rounded-md bg-light-100 dark:bg-dark-100 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {DIFFICULTY.map((d) => (
                            <Listbox.Option
                                key={d.id}
                                value={d}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-10 w-60 ${
                                        active ? "bg-green-200 text-light-100 dark:text-dark-100" : "text-dark-100 dark:text-light-100"
                                    }`
                                }
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{d.difficulty}</span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 
                                                    ${active ? "text-light-100 dark:text-dark-100" : "text-green-200"}
                                                    `}
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
            </Listbox>
        </div>
    );
}
