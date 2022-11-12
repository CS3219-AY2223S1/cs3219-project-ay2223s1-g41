import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import FoundMatchModal from "../components/FoundMatchModal";
import { io, Socket } from "socket.io-client";
import router from "next/router";
import SelectDifficultyListbox from "../components/SelectDifficultyListbox";
import FindingMatchModal from "../components/dashboard/FindingMatchModal";
import { useSession } from "next-auth/react";
import Background from "../components/dashboard/Background";

export default function Dashboard() {
    //let socket: Socket;

    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/log-in").then((r) => r);
        },
    });

    const [selectedDifficulty, setSelectedDifficulty] = useState<Array<{ id: number; difficulty: string }>>([]);

    const [isMatchFound, setIsMatchFound] = useState<boolean>(false);
    //const [foundMatchCountdown, setFoundMatchCountdown] = useState<number>(0);
    const [isInMatch, setIsInMatch] = useState<boolean>(false);
    const [isFindingMatch, setIsFindingMatch] = useState<boolean>(false);

    const [isMatchProcessed, setIsMatchProcessed] = useState<boolean>(false);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (isFindingMatch) {
            console.log("mounted");
            fetch("/api/matching/socket").then(() => {
                const localSocket = io();
                setSocket(localSocket);
                socketInitializer(localSocket);
            });
        }
        if (isMatchProcessed) {
            return () => {
                //isMounted.current = false;
                socket?.disconnect();
                console.log("clean up and unmount");
                setIsMatchProcessed(false);
            };
        }
    }, [isFindingMatch]);

    const socketInitializer = async (socket: Socket) => {
        // on connection
        socket!.on("connect", () => {
            console.log("connected");
            console.log(socket.id);
            socket?.emit("find-match", selectedDifficulty);
        });

        socket!.on("match-found", () => {
            //setIsFindingMatch(false);
            setIsMatchFound(true);
            //setFoundMatchCountdown(10);
        });

        socket!.on("other-declined", () => {
            alert("The other user has declined");
            //socket?.disconnect();
            //setSocket(null);
            setIsMatchFound(false);
            setIsFindingMatch(false);
            setIsMatchProcessed(true);
            //return;
            socket.disconnect();
        });

        socket!.on("assign-room", (room) => {
            setIsInMatch(true);
            setIsFindingMatch(false);
            setIsMatchFound(true);
            //setFoundMatchCountdown(10);
            //if (isInMatch) {
            setIsMatchProcessed(true);
            console.log("Joined room " + room);
            router.replace("/coderoom/" + room).then((r) => r);
        });
    };

    return (
        <>
            <Head>
                <title>PeerPrep | Dashboard</title>
            </Head>
            <main className="flex flex-col min-h-screen justify-center items-center">
                <div className="flex flex-col mt-16">
                    <Background>
                        <div className="w-full dark:bg-dark-200 bg-gray-100 shadow-2xl py-10 flex flex-col gap-10">
                            <div className="text-3xl font-bold text-dark-100 dark:text-light-100 text-center font-mono flex justify-center items-center">
                                <p>Welcome to</p>
                                <p className="ml-5 hover:text-green-200 hover:transition-colors">PeerPrep</p>
                                <p>!</p>
                            </div>

                            <div className="flex justify-center items-center gap-4">
                                <SelectDifficultyListbox selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty} />
                                <button
                                    disabled={selectedDifficulty.length == 0 || isFindingMatch}
                                    className="bg-green-700 color-white rounded-md p-2 text-green-900 font-bold hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                                    onClick={() => {
                                        setIsFindingMatch(true);
                                    }}
                                >
                                    {isFindingMatch ? "Finding..." : "Find Match!"}
                                </button>
                                {isFindingMatch && (
                                    <button
                                        className="bg-red-400 color-white rounded-md p-2 text-green-900 font-bold hover:opacity-70 disabled:opacity-50 disabled:shadow-none"
                                        onClick={() => {
                                            setIsFindingMatch(false);
                                            socket?.emit("cancel-find-match", socket.id);
                                            console.log("disconnect");
                                            socket?.disconnect();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </Background>
                </div>

                {/* isStartToFindMatch and isMatchFound should always be opposite of each other */}

                {isFindingMatch && !isMatchFound && <FindingMatchModal setIsFindingMatch={setIsFindingMatch} socket={socket} />}

                {isMatchFound && !isMatchProcessed && (
                    <FoundMatchModal
                        isMatchFound={isMatchFound}
                        setIsMatchFound={setIsMatchFound}
                        setIsFindingMatch={setIsFindingMatch}
                        setIsMatchProcessed={setIsMatchProcessed}
                        socket={socket}
                    />
                )}
            </main>
        </>
    );
}
