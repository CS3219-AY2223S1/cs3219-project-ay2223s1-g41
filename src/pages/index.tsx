import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { SpinnerInfinity } from "spinners-react";

const Home: NextPage = () => {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/log-in").then((r) => r);
        },
    });

    const Redirect = () => {
        router.replace("/dashboard").then((r) => r);
        return <></>;
    };

    return (
        <>
            <Head>
                <title>PeerPrep | {status == "loading" ? "Loading..." : "Dashboard"}</title>
            </Head>
            <main className="flex flex-col justify-center h-screen gap-6">
                {status == "loading" ? (
                    <div>
                        <div className="absolute inset-0 z-50 flex items-center justify-center ">
                            <div className="flex items-center justify-center p-4 transition bg-green-700 rounded-md shadow-md w-36 h-36 dark:bg-green-900 bg-opacity-80">
                                <SpinnerInfinity color="#3e6cff" size={80} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <Redirect />
                )}
            </main>
        </>
    );
};

export default Home;
