import Head from "next/head";
import NotificationSuccess from "../components/NotificationSuccess";
import Sidebar from "../components/Sidebar";
import { SpinnerInfinity } from "spinners-react";
import axios from "axios";
import router from "next/router";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import useToggle from "../lib/useToggle";

const ip = require("ip");

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  error: string;
};

const PASSWORD_MATCH_ERROR = "Passwords do not match";

export default function ChangePassword() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/log-in");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>();

  const onSubmit = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }: FormValues) => {
    if (newPassword !== confirmPassword) {
      setError("error", {
        type: "custom",
        message: PASSWORD_MATCH_ERROR,
      });
    } else {
      try {
        const res = await axios.patch("/api/user/change-password", {
          oldPassword,
          newPassword,
        });
        reset();
        toggleShow();
      } catch (err) {
        setError("error", {
          type: "custom",
          message: JSON.stringify(err),
        });
      }
    }
  };

  const [show, toggleShow] = useToggle();

  return (
    <>
      <Head>
        <title>Spice | Change Password</title>
      </Head>
      <main className="flex min-h-screen gap-12">
        {status == "loading" ? (
          <div>
            <div className="absolute inset-0 z-50 flex items-center justify-center ">
              <div className="flex items-center justify-center p-4 transition bg-white rounded-md shadow-md w-36 h-36 dark:bg-blue-700 bg-opacity-80">
                <SpinnerInfinity color="#3e6cff" size={80} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <Sidebar />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 w-72"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="oldPassword">Old Password</label>
                <input
                  type="password"
                  {...register("oldPassword", {
                    required: true,
                  })}
                />
                {errors.oldPassword && (
                  <span className="error">Old password is required</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  {...register("newPassword", {
                    required: true,
                  })}
                />
                {errors.newPassword && (
                  <span className="error">New password is required</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: true,
                  })}
                />
                {errors.confirmPassword && (
                  <span className="error">
                    Password confirmation is required
                  </span>
                )}
              </div>
              <input type="hidden" {...register("error")} />
              {errors.error && (
                <span className="error">{errors.error.message}</span>
              )}
              <button className="justify-center mt-4 btn-primary">
                Change Password
              </button>
            </form>
          </>
        )}
      </main>
      {show && (
        <NotificationSuccess
          toggleShow={toggleShow}
          text="Password changed successfully!"
        />
      )}
    </>
  );
}
