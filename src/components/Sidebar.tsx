import { ArrowLeftIcon, ClipboardListIcon, KeyIcon, UserIcon } from "@heroicons/react/solid";

import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
    const router = useRouter();

    return (
        <nav className="flex flex-col flex-none gap-6">
            <Link href="/profile">
                <a
                    className={`${
                        router.pathname == "/profile" ? "text-green-200 dark:text-green-200" : "text-dark-100 dark:text-green-100"
                    } font-bold flex items-center gap-2 text-sm`}
                >
                    <UserIcon className="w-5 h-5" />
                    Profile
                </a>
            </Link>
            <Link href="/change-password">
                <a
                    className={`${
                        router.pathname == "/change-password" ? "text-green-200 dark:text-green-200" : "text-dark-100 dark:text-green-100"
                    } font-bold flex items-center gap-2 text-sm`}
                >
                    <KeyIcon className="w-5 h-5" />
                    Change Password
                </a>
            </Link>
        </nav>
    );
}
