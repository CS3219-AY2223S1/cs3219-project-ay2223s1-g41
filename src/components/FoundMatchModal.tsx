import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, useEffect } from "react";

export default function FoundMatchModal({
  matchFound,
  setMatchFound,
  foundMatchCountdown,
  setFoundMatchCountdown,
  setIsInMatch,
}: {
  matchFound: boolean;
  setMatchFound: Dispatch<boolean>;
  foundMatchCountdown: number;
  setFoundMatchCountdown: Dispatch<number>;
  setIsInMatch: Dispatch<boolean>;
}) {
  if (matchFound) {
    useEffect(() => {
      foundMatchCountdown > -1 &&
        setTimeout(() => setFoundMatchCountdown(foundMatchCountdown - 1), 1000);
    }, [foundMatchCountdown]);
    console.log("foundMatchModal");
    if (foundMatchCountdown == -1) {
      return <></>;
    }

    return (
      <>
        <Transition appear show={matchFound} as={Fragment}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="flex flex-row text-lg font-medium leading-6 text-gray-900 justify-between "
                    >
                      <p className="dark:text-gray-900">Found Match!</p>
                      <p className="dark:text-gray-900">
                        {foundMatchCountdown}
                      </p>
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-900">
                        Click Accept to enter, or Decline to cancel.
                      </p>
                    </div>

                    <div className="flex flex-row mt-4 justify-between">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setMatchFound(false);
                          setIsInMatch(true);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={() => setMatchFound(false)}
                      >
                        Decline
                      </button>
                    </div>
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
