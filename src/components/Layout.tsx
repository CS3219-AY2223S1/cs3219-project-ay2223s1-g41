import Navbar from "./Navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="px-6 pb-6 pt-26">{children}</div>
    </>
  );
}
