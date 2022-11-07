import { signIn, useSession } from "next-auth/react";

import Head from "next/head";
import { NextPage } from "next";
import React from "react";
import { SpinnerInfinity } from "spinners-react";
import router from "next/router";
import { useForm } from "react-hook-form";

type FormValues = {
    email: string;
    password: string;
    error: string;
};

const LogIn: NextPage = () => {
    const { data: session, status } = useSession();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = handleSubmit(async ({ email, password }: FormValues) => {
        const status: any = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (status.error) {
            setError("error", { type: "custom", message: status.error });
        }
    });

    if (status === "authenticated") {
        router.replace("/dashboard").then((r) => r);
    }

    const title = `PeerPrep | ${status == "loading" ? "Loading..." : status == "authenticated" ? "Redirecting..." : "Log In"}`;

    return (
        <div className="pt-20">
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 -mt-27">
                {status == "loading" ? (
                    <div>
                        <div className="absolute inset-0 z-50 flex items-center justify-center ">
                            <div className="flex items-center justify-center p-4 transition bg-green-700 rounded-md shadow-md w-36 h-36 dark:bg-green-900 bg-opacity-80">
                                <SpinnerInfinity color="#3e6cff" size={80} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1>PeerPrep</h1>
                        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-72">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" {...register("email", { required: true })} />
                                {errors.email && <span className="error">Email address is required</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between gap-4">
                                    <label htmlFor="password">Password</label>
                                </div>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: true,
                                    })}
                                />
                                {errors.password && <span className="error">Password is required</span>}
                            </div>
                            <input type="hidden" {...register("error")} />
                            {errors.error && <span className="error">{errors.error.message}</span>}
                            <button type="submit" className="justify-center mt-2 btn-primary">
                                Log In
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default LogIn;
