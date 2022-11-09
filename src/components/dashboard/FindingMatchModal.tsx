import { XIcon } from "@heroicons/react/solid";
import { Dispatch, useEffect, useRef, useState } from "react";

export default function FindingMatchModal({ setIsFindingMatch, socket }: { setIsFindingMatch: Dispatch<boolean>; socket: any }) {
    const [timeLeft, setTimeLeft] = useState(30);

    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            if (timeLeft > -3) {
                setTimeLeft(timeLeft - 1);
            }
        }, 1000);
        if (timeLeft === -3) {
            setIsFindingMatch(false);
            socket?.emit("cancel-find-match", socket.id);
            console.log("disconnect");
            socket?.disconnect();
            return () => {
                clearTimeout(timeoutRef.current);
            };
        }
    }, [timeLeft]);

    return (
        <div className="flex flex-row items-center fixed bottom-5 dark:bg-dark-200 bg-white h-25 w-1/2 rounded-lg shadow-xl">
            {timeLeft <= 0 && (
                <div className="flex flex-row items-center justify-center fixed bottom-5 h-25 w-1/2 rounded-lg">
                    <p className="text-2xl font-bold dark:text-red-400 text-red-600 text-center">Unable to find match! Please try again later.</p>
                </div>
            )}
            {timeLeft > 0 && (
                <>
                    <div className="flex border-r border-r-gray h-5/6 w-1/6 justify-center items-center">
                        <p className="text-2xl font-bold dark:text-green-200 text-green-800 text-center"> {timeLeft}</p>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <p className="flex text-2xl font-bold dark:text-green-200 text-green-800 text-center justify-center items-center">
                            Finding match...
                        </p>
                    </div>
                    <button
                        className="pr-5"
                        onClick={() => {
                            setIsFindingMatch(false);
                            socket?.emit("cancel-find-match", socket.id);
                            console.log("disconnect");
                            socket?.disconnect();
                        }}
                    >
                        <XIcon className="w-5 h-5 text-red-600" aria-hidden="true" />
                    </button>
                </>
            )}
        </div>
    );
}
