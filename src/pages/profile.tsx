import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { SpinnerInfinity } from "spinners-react";
import router from "next/router";
import { useSession } from "next-auth/react";

export default function Profile() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/log-in");
        },
    });

    return (
        <div className="pt-30 px-10">
            <Head>
                <title>Spice | Profile</title>
            </Head>
            <main className="flex min-h-screen gap-12">
                {status == "loading" ? (
                    <div>
                        <div className="absolute inset-0 z-50 flex items-center justify-center ">
                            <div className="flex items-center justify-center p-4 transition bg-green-100 rounded-md shadow-md w-36 h-36 dark:bg-green-700 bg-opacity-80">
                                <SpinnerInfinity color="#3e6cff" size={80} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <Sidebar />
                        <div className="flex w-full gap-2">
                            <h1 className="text-sm">User:</h1>
                            <h1 className="text-sm">{session?.user?.email}</h1>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
