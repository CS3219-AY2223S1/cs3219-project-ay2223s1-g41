import Navbar from "./Navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="pt-20">{children}</div>
        </>
    );
}
