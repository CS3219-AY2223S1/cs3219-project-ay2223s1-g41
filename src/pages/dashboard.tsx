import { Listbox, Transition, Dialog } from "@headlessui/react";
import Head from "next/head";
import React, { Dispatch, SetStateAction, useState, Fragment, useEffect } from "react";
import { CheckIcon, ChevronDownIcon, XIcon } from "@heroicons/react/solid";
import FoundMatchModal from "../components/FoundMatchModal";
import io from "socket.io-client";
import router from "next/router";
import SelectDifficultyListbox from "../components/SelectDifficultyListbox";

const findMatchPopUp = (isOpen: Boolean, isMatching: Boolean, roomNum: String) => {
    if (isOpen) {
        return isMatching ? <div>Finding matching...</div> : <div>Found {roomNum}</div>;
    } else {
        return <></>;
    }
};

const FindingMatchModal = ({
    //isOpen,
    roomNum,
    isFindingMatch,
    setIsFindingMatch,
    timeLeft,
    setTimeLeft,
    matchFound,
    setMatchFound,
    foundMatchCountdown,
    setFoundMatchCountdown,
    setIsInMatch,
}: {
    //isOpen: Boolean;
    roomNum: String;
    isFindingMatch: boolean;
    setIsFindingMatch: Dispatch<boolean>;
    timeLeft: number;
    setTimeLeft: Dispatch<number>;
    matchFound: boolean;
    setMatchFound: Dispatch<boolean>;
    foundMatchCountdown: number;
    setFoundMatchCountdown: Dispatch<number>;
    setIsInMatch: Dispatch<boolean>;
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
                    <p className="text-2xl font-bold text-red-800 text-center">Unable to find match! Please try again later.</p>
                </div>
            );
        }

        return (
            <div className="flex flex-row items-center fixed bottom-5 bg-white h-25 w-1/2 rounded-lg">
                <div className="flex border-r border-r-gray h-5/6 w-1/6 justify-center items-center">
                    <p className="text-2xl font-bold text-green-800 text-center">{timeLeft.toString()}</p>
                </div>
                <div className="flex justify-center items-center w-full">
                    <p className="flex text-2xl font-bold text-green-800 text-center justify-center items-center">Finding match...</p>
                </div>
                <button className="pr-5" onClick={() => setIsFindingMatch(false)}>
                    <XIcon className="w-5 h-5 text-red-800" aria-hidden="true" />
                </button>
            </div>
        );
    } else {
        if (timeLeft < 0) {
            return <></>;
        } else {
            return (
                <FoundMatchModal
                    matchFound={matchFound}
                    setMatchFound={setMatchFound}
                    foundMatchCountdown={foundMatchCountdown}
                    setFoundMatchCountdown={setFoundMatchCountdown}
                    setIsInMatch={setIsInMatch}
                />
            );
        }
    }
};

// const findMatchPopUp = (
//   isOpen: Boolean,
//   isFindingMatch: Boolean,
//   roomNum: String
// ) => {
//   if (isOpen) {
//     return isFindingMatch ? (
//       <div>Finding matching...</div>
//     ) : (
//       <div>Found {roomNum}</div>
//     );
//   } else {
//     return <></>;
//   }
// };

export default function Dashboard() {
    const [selectedDifficulty, setSelectedDifficulty] = useState<Array<{ id: number; difficulty: string }>>([]);
    // const [isOpen, setIsOpen] = useState<Boolean>(false);
    // const [isMatching, setIsMatching] = useState<Boolean>(true);
    // const [roomNum, setRoomNum] = useState<String>("");
    // let socket:any;

    // function openModal() {
    //   setIsOpen(true);
    //   socketInitializer();
    // }

    const [matchFound, setMatchFound] = useState<boolean>(true);
    const [foundMatchCountdown, setFoundMatchCountdown] = useState<number>(0);
    const [isInMatch, setIsInMatch] = useState<boolean>(false);
    const [isFindingMatch, setIsFindingMatch] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const [roomNum, setRoomNum] = useState<String>("");
    let socket: any;

    function openModal() {
        setIsOpen(true);
        socketInitializer();
    }

    const socketInitializer = async () => {
        // Call default io
        await fetch("/api/matching/socket");

        socket = io();
        console.log(socket);
        // on connection
        socket.on("connect", () => {
            console.log("connected");
            console.log(socket.id);
        });
        // matched
        socket.on("assign-room", (room: string) => {
            setIsFindingMatch(false);
            setMatchFound(true);
            setFoundMatchCountdown(10);
            if (isInMatch) {
                console.log(isInMatch);
                console.log("here");
                setRoomNum(room);
                console.log("Joined room " + room);
                setTimeout(() => {
                    router.replace("/coderoom/" + room).then((r) => r);
                }, 3000);
            }
        });
    };

    // const socketInitializer = async () => {
    //   // Call default io
    //   await fetch("/api/matching/socket");

    //   socket = io();
    //   console.log(socket)
    //   // on connection
    //   socket.on('connect', () => {
    //     console.log('connected');
    //     console.log(socket.id);
    //   })
    //   // matched
    //   socket.on('assign-room', (room: string) => {
    //     setIsMatching(false);
    //     setRoomNum(room);
    //     console.log('Joined room '+ room);
    //     setTimeout(()=>{
    //       router.replace("/coderoom/" + room).then((r) => r);
    //     }, 3000)
    //   })
    // };

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <main className="flex flex-col items-center min-h-screen gap-6">
                <text className="text-2xl font-bold text-green-800 dark:text-white">Welcome to PeerPrep!</text>

                <SelectDifficultyListbox selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty} />
                <button
                    disabled={selectedDifficulty.length == 0 || isFindingMatch}
                    className="relative bg-green-700 color-white rounded-md px-4 py-3 text-green-900 font-bold hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                    onClick={() => {
                        setIsFindingMatch(true);
                        setTimeLeft(10);
                        openModal();
                    }}
                >
                    {isFindingMatch ? "Finding..." : "Find Match!"}
                </button>
                {/* {findMatchPopUp(isOpen, isFindingMatch, roomNum)} */}

                {isOpen && (
                    <FindingMatchModal
                        roomNum={roomNum}
                        isFindingMatch={isFindingMatch}
                        setIsFindingMatch={setIsFindingMatch}
                        timeLeft={timeLeft}
                        setTimeLeft={setTimeLeft}
                        matchFound={matchFound}
                        setMatchFound={setMatchFound}
                        foundMatchCountdown={foundMatchCountdown}
                        setFoundMatchCountdown={setFoundMatchCountdown}
                        setIsInMatch={setIsInMatch}
                    />
                )}
            </main>
        </>
    );
}
