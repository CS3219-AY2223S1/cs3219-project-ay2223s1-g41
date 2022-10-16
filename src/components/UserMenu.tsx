import { LogoutIcon, UserCircleIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import { Fragment } from "react";
import Image from "next/image";
import router from "next/router";
import { signOut } from "next-auth/react";

export default function UserMenu() {
    return (
        <Menu as="div" className="relative">
            <Menu.Button className="relative w-8 h-8 overflow-hidden rounded-full ring-2 dark:ring-green-200 ring-dark-100 ring-offset-2 ring-offset-light-100 dark:ring-offset-dark-200">
                <Image src="/profile.png" alt="profile" layout="fill" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Menu.Items className="absolute right-0 w-56 p-2 mt-4 text-blue-800 origin-top-right bg-white rounded shadow-lg dark:text-white dark:bg-gray-900 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`${
                                    active ? "dark:bg-gray-700 bg-gray-100" : ""
                                } flex w-full items-center gap-2 rounded p-2 transition-colors`}
                                onClick={() => router.push("/profile")}
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                Account
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={async () => {
                                    await signOut({ redirect: false });
                                    await router.replace("/log-in");
                                }}
                                className={`${
                                    active ? "dark:bg-gray-700 bg-gray-100" : ""
                                } flex w-full items-center gap-2 rounded p-2 transition-colors`}
                            >
                                <LogoutIcon className="w-5 h-5" />
                                Log Out
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
