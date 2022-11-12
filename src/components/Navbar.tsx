import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { THEME } from "../utils/constants";
import ToggleDarkMode from "./ToggleDarkMode";
import UserMenu from "./UserMenu";
import router from "next/router";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const Navbar = () => {
    const { status } = useSession();
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const { theme } = useTheme();

    useEffect(() => setHasMounted(true), []);

    if (!hasMounted) return null;

    return (
        <header className="fixed z-40 flex items-center justify-between w-full gap-4 p-6 bg-green-200 dark:bg-dark-200">
            <nav className="flex items-center gap-6">
                <Link href="/dashboard">
                    <a className="relative w-8 h-8">
                        <Image src={`/logo-${theme === THEME.DARK ? THEME.DARK : THEME.LIGHT}.svg`} alt="logo" priority={true} layout="fill" />
                    </a>
                </Link>
                {status == "authenticated" && (
                    <>
                        <Link href="/dashboard">
                            <a className={"text-dark-200 dark:text-green-100 transition-colors font-bold text-sm"}>Dashboard</a>
                        </Link>
                    </>
                )}
            </nav>
            <div className="flex items-center gap-6">
                <ToggleDarkMode />
                {status == "loading" ? (
                    <p>Loading...</p>
                ) : status == "authenticated" ? (
                    <UserMenu />
                ) : router.pathname == "/sign-up" ? (
                    <button onClick={() => router.push("/log-in")} className="btn-primary">
                        Log In
                    </button>
                ) : (
                    <button onClick={() => router.push("/sign-up")} className="btn-secondary">
                        Sign Up
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
