import { Listbox, Transition, Dialog } from "@headlessui/react";
import Head from "next/head";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  Fragment,
  useEffect,
} from "react";
import { CheckIcon, ChevronDownIcon, XIcon } from "@heroicons/react/solid";

const difficulty = [
  { id: 1, difficulty: "Easy" },
  { id: 2, difficulty: "Medium" },
  { id: 3, difficulty: "Hard" },
];

const DifficultyButton = ({
  selectedDifficulty,
  setSelectedDifficulty,
}: {
  selectedDifficulty: Array<{ id: number; difficulty: string }>;
  setSelectedDifficulty: Dispatch<
    SetStateAction<Array<{ id: number; difficulty: string }>>
  >;
}) => {
  return (
    <Listbox
      value={selectedDifficulty}
      onChange={setSelectedDifficulty}
      multiple
    >
      <Listbox.Button className="relative w-200 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm dark:text-black">
        <span className="block truncate h-5">
          Select difficulty:{" "}
          {selectedDifficulty.map((d) => d.difficulty).join(", ")}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="relative max-h-60 w-200 overflow-auto py-1 rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {difficulty.map((d) => (
            <Listbox.Option
              key={d.id}
              value={d}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 w-200${
                  active
                    ? "bg-green-100 text-green-800"
                    : "text-gray-900 dark:text-black"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {d.difficulty}
                  </span>
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
};

const FindingMatchModal = ({
  isFindingMatch,
  setIsFindingMatch,
  timeLeft,
  setTimeLeft,
}: {
  isFindingMatch: boolean;
  setIsFindingMatch: Dispatch<boolean>;
  timeLeft: number;
  setTimeLeft: Dispatch<number>;
}) => {
  if (isFindingMatch) {
    useEffect(() => {
      timeLeft > -3 && setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }, [timeLeft]);
    if (timeLeft == -3) {
      setIsFindingMatch(false);
      return <></>;
    }
    if (timeLeft <= 0) {
      return (
        <div className="flex flex-row items-center justify-center fixed bottom-5 bg-white h-25 w-1/2 rounded-lg">
          <p className="text-2xl font-bold text-red-800 text-center">
            Unable to find match! Please try again later.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-row items-center fixed bottom-5 bg-white h-25 w-1/2 rounded-lg">
        <div className="flex border-r border-r-gray h-5/6 w-1/6 justify-center items-center">
          <p className="text-2xl font-bold text-green-800 text-center">
            {timeLeft.toString()}
          </p>
        </div>
        <div className="flex justify-center items-center w-full">
          <p className="flex text-2xl font-bold text-green-800 text-center justify-center items-center">
            Finding match...
          </p>
        </div>
        <button className="pr-5" onClick={() => setIsFindingMatch(false)}>
          <XIcon className="w-5 h-5 text-red-800" aria-hidden="true" />
        </button>
      </div>
    );
  } else {
    return <></>;
  }
};

export default function Dashboard() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Array<{ id: number; difficulty: string }>
  >([]);

  const [matchFound, setMatchFound] = useState<boolean>(true);
  const [foundMatchCountdown, setFoundMatchCountdown] = useState<number>(0);
  const [isInMatch, setIsInMatch] = useState<boolean>(false);
  const [isFindingMatch, setIsFindingMatch] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);


  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className="flex flex-col items-center min-h-screen gap-6">
        <text className="text-2xl font-bold text-green-800 dark:text-white">
          Welcome to PeerPrep!
        </text>

        <DifficultyButton
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />
        <button
          disabled={selectedDifficulty.length == 0 || isFindingMatch}
          className="relative bg-green-700 color-white rounded-md px-4 py-3 text-green-900 font-bold hover:shadow-md disabled:opacity-50 disabled:shadow-none"
          onClick={() => {
            setIsFindingMatch(true);
            setTimeLeft(10);
          }}
        >
          {isFindingMatch ? "Finding..." : "Find Match!"}
        </button>
        <button
          onClick={() => {
            setMatchFound(true);
            setFoundMatchCountdown(10);
          }}
        >
          found match trigger (temporary)
        </button>
        <FoundMatchModal
          matchFound={matchFound}
          setMatchFound={setMatchFound}
          foundMatchCountdown={foundMatchCountdown}
          setFoundMatchCountdown={setFoundMatchCountdown}
          setIsInMatch={setIsInMatch}
        <FindingMatchModal
          isFindingMatch={isFindingMatch}
          setIsFindingMatch={setIsFindingMatch}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
        />
      </main>
    </>
  );
}
