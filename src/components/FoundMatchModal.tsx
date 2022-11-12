import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";

export default function FoundMatchModal({
    isMatchFound,
    setIsMatchFound,
    setIsFindingMatch,
    socket,
    setIsMatchProcessed,
}: {
    isMatchFound: boolean;
    setIsMatchFound: Dispatch<boolean>;
    setIsFindingMatch: Dispatch<SetStateAction<boolean>>;
    socket: any;
    setIsMatchProcessed: Dispatch<SetStateAction<boolean>>;
}) {
    const [foundMatchCountdown, setFoundMatchCountdown] = useState(10);
    const [isAccepted, setIsAccepted] = useState<boolean>(false);
    const [isDeclined, setIsDeclined] = useState<boolean>(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    if (isMatchFound) {
        useEffect(() => {
            timeoutRef.current = setTimeout(() => {
                if (foundMatchCountdown > -1) {
                    setFoundMatchCountdown(foundMatchCountdown - 1);
                }
            }, 1000);

            //foundMatchCountdown > -1 && setTimeout(() => setFoundMatchCountdown(foundMatchCountdown - 1), 1000);
            if (foundMatchCountdown === -3) {
                setIsFindingMatch(false);
                socket?.emit("cancel-find-match", socket.id);
                socket.disconnect();
                return () => {
                    clearTimeout(timeoutRef.current);
                };
            }
        }, [foundMatchCountdown]);
        return (
            <>
                <Transition appear show={isMatchFound} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => {}}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl dark:bg-dark-100 bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        {foundMatchCountdown > 0 && (
                                            <>
                                                <Dialog.Title
                                                    as="h3"
                                                    className="flex flex-row text-lg font-medium leading-6 dark:text-gray-900 justify-between "
                                                >
                                                    <p className="text-gray-900 dark:text-white">Found Match!</p>
                                                    <p className="text-gray-900 dark:text-white">{foundMatchCountdown}</p>
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        Click Accept to enter, or Decline to cancel.
                                                    </p>
                                                </div>

                                                <div className="flex flex-row mt-4 justify-between">
                                                    <button
                                                        type="button"
                                                        disabled={isAccepted} // note that if the button is not disabled, the user can click accept twice which tricks the socket to think that two users have accepted, to save complication in the backend, this button is disabled after accepting the match
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-200 px-4 py-2 text-sm font-medium text-blue-900 enabled:hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-opacity-40"
                                                        onClick={() => {
                                                            socket.emit("accept", socket.id);
                                                            setIsAccepted(true);
                                                        }}
                                                    >
                                                        {isAccepted ? "Waiting for the other user..." : "Accept"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                                        onClick={() => {
                                                            socket.emit("decline", socket.id);
                                                            setIsFindingMatch(false);
                                                            setIsDeclined(true);
                                                            setIsMatchFound(false);
                                                            setIsMatchProcessed(true);
                                                            console.log("disconnect");
                                                            socket.disconnect();
                                                        }}
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        {foundMatchCountdown <= 0 && (
                                            <>
                                                <Dialog.Title
                                                    as="h3"
                                                    className="flex flex-col gap-4 text-lg font-medium leading-6 dark:text-gray-900 justify-between "
                                                >
                                                    <p className="text-gray-900 dark:text-white">Timeout!</p>
                                                    <p className="text-gray-900 dark:text-white">Please match again.</p>
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-200 px-4 py-2 text-sm font-medium text-blue-900 enabled:hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-opacity-40"
                                                        onClick={() => {
                                                            setIsMatchProcessed(true);
                                                            setIsFindingMatch(false);
                                                            socket?.emit("cancel-find-match", socket.id);
                                                            socket.disconnect();
                                                        }}
                                                    >
                                                        Okay
                                                    </button>
                                                </Dialog.Title>
                                            </>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>
        );
    } else {
        return <></>;
    }
}
