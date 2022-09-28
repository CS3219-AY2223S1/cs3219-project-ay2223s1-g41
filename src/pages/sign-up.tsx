import Head from "next/head";
import { NextPage } from "next";
import router from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
  repeatedPassword: string;
};

const SignUp: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [signUpError, setSignUpError] = useState("");

  const onSubmit = handleSubmit(
    async ({ email, password, repeatedPassword }: FormValues) => {
      if (password !== repeatedPassword) {
        setSignUpError("Passwords don't match");
      } else if (!email.includes("@")) {
        setSignUpError("Invalid email");
      } else {
        try {
          const axios = require("axios").default;
          const res = await axios.post("/api/auth/sign-up", {
            email,
            password,
          });
          await router.replace("/dashboard");
        } catch (error: any) {
          setSignUpError(JSON.stringify(error, null, 2));
        }
      }
    }
  );

  return (
    <>
      <Head>
        <title>PeerPrep | Sign Up</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 -mt-27">
        <h1>Spice</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-72">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email Address</label>
            <input {...register("email", { required: true })} />
            {errors.email && (
              <span className="error">Email address is required</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input {...register("password", { required: true })} />
            {errors.password && (
              <span className="error">Password is required</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="repeatedPassword">Repeat Password</label>
            <input
              {...register("repeatedPassword", {
                required: true,
              })}
            />
            {errors.repeatedPassword && (
              <span className="error">Repeated password is required</span>
            )}
          </div>
          {signUpError && (
            <span className="text-sm text-red-500 dark:text-red-400">
              {signUpError}
            </span>
          )}
          <button className="mt-2 btn-primary justify-center">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
