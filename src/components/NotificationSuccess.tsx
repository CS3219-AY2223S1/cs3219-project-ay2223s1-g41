import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";

type NotificationSuccessProps = {
  text: string;
  toggleShow: () => void;
};

export default function NotificationSuccess({
  text,
  toggleShow,
}: NotificationSuccessProps) {
  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 z-40 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          <Transition
            show
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="flex items-center gap-4 p-4 bg-green-200 border border-green-400 rounded-md shadow-md pointer-events-auto">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-semibold">{text}</span>
              </div>
              <button className="text-green-600" onClick={toggleShow}>
                <span className="sr-only">Close</span>
                <XIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
