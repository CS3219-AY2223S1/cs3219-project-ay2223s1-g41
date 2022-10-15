import { Listbox, Transition, Dialog } from "@headlessui/react";
import Head from "next/head";
import React, { Dispatch, SetStateAction, useState, Fragment } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import io from "socket.io-client";

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
                  active ? "bg-green-100 text-green-800" : "text-gray-900"
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

const findMatchPopUp = (isOpen:Boolean, isMatching:Boolean , roomNum:String) => {
  if (isOpen){
    return(isMatching
      ? <div>
        Finding matching...
        </div>
      :
      <div>
        Found {roomNum}
      </div>)
  } else {
    return (<></>)
  }
};

export default function Dashboard() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Array<{ id: number; difficulty: string }>
  >([]);
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [isMatching, setIsMatching] = useState<Boolean>(true);
  const [roomNum, setRoomNum] = useState<String>("");
  let socket:any;

  function openModal() {
    setIsOpen(true);
    socketInitializer();
  }

  const socketInitializer = async () => {
    // Call default io
    await fetch("/api/matching/socket");

    socket = io();
    // on connection
    socket.on('connect', () => {
      console.log('connected');
      console.log(socket.id);
    })
    // matched
    socket.on('assign-room', (room: string) => {
      setIsMatching(false);
      setRoomNum(room);
      console.log('Joined room '+ room);
    })
    
    socket.on("newIncomingMessage", (msg:any) => {
      // setMessages((currentMsg) => [
      //   ...currentMsg,
      //   { author: msg.author, message: msg.message },
      // ]);
      // console.log(messages);
    });
  };
  
  const sendMessage = async () => {
    // socket.emit("createdMessage", { author: chosenUsername, message });
    // setMessages((currentMsg) => [
    //   ...currentMsg,
    //   { author: chosenUsername, message },
    // ]);
    // setMessage("");
  };


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
          disabled={selectedDifficulty.length == 0}
          className="relative bg-green-700 color-white rounded-md px-4 py-3 text-green-900 font-bold hover:shadow-md disabled:opacity-50 disabled:shadow-none"
          onClick={openModal}
        >
          Find match!
        </button>
        {findMatchPopUp(isOpen, isMatching,roomNum)}
      </main>
    </>
  );
}
