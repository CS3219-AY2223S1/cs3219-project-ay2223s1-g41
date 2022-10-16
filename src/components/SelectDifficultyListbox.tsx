import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/solid";
import { Dispatch, SetStateAction, Fragment } from "react";
import { DIFFICULTY } from "../utils/constants";

export default function SelectDifficultyListbox({
    selectedDifficulty,
    setSelectedDifficulty,
}: {
    selectedDifficulty: Array<{ id: number; difficulty: string }>;
    setSelectedDifficulty: Dispatch<SetStateAction<Array<{ id: number; difficulty: string }>>>;
}) {
    return (
        <Listbox value={selectedDifficulty} onChange={setSelectedDifficulty} multiple>
            <Listbox.Button className="relative w-200 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm dark:text-black">
                <span className="block truncate h-5">Select difficulty: {selectedDifficulty.map((d) => d.difficulty).join(", ")}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="relative max-h-60 w-200 overflow-auto py-1 rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {DIFFICULTY.map((d) => (
                        <Listbox.Option
                            key={d.id}
                            value={d}
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 w-200${
                                    active ? "bg-green-100 text-green-800" : "text-gray-900 dark:text-black"
                                }`
                            }
                        >
                            {({ selected }) => (
                                <>
                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{d.difficulty}</span>
                                    {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
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
    );
}
