import router from "next/router";
import { useContext } from "react";
import { useStopwatch } from "react-timer-hook";
import { RoomContext } from "../../pages/coderoom/[roomNum]";
import ReactTooltip from "react-tooltip";

const Digit = ({ value }: { value: number }) => {
    const leftDigit = value >= 10 ? value.toString()[0] : "0";
    const rightDigit = value >= 10 ? value.toString()[1] : value.toString();
    return (
        <div>
            <>{leftDigit}</>
            <>{rightDigit}</>
        </div>
    );
};

const Timer = () => {
    const { seconds, minutes, hours } = useStopwatch({ autoStart: true });

    return (
        <div>
            <div className="flex text-2xl">
                <span>
                    <Digit value={hours} />
                </span>
                :
                <span>
                    <Digit value={minutes} />
                </span>
                :
                <span>
                    <Digit value={seconds} />
                </span>
            </div>
        </div>
    );
};

export default function StatusBar({ createTime }: { createTime: Date }) {
    const { socket, roomNum, session } = { ...useContext(RoomContext) };
    console.log(socket);
    return (
        <header className="sticky top-20 z-30 flex justify-between items-center w-full p-4 bg-white dark:bg-dark-100 shadow-lg">
            <div
                data-tip
                data-for="room-detail"
                className="flex items-center gap-2 px-4 py-1 font-bold outline outline-green-200 bg-green-200 rounded text-dark-100"
            >
                Room number: {roomNum}
            </div>

            <ReactTooltip id="room-detail" effect="solid" place="bottom">
                <span>Room created at: {createTime.toLocaleString()}</span>
            </ReactTooltip>

            <Timer />

            <button
                className="btn-leave-room"
                onClick={() => {
                    //socket.disconnect();
                    router.replace("/dashboard").then((r) => r);
                }}
            >
                Leave room
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path
                        fillRule="evenodd"
                        d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </header>
    );
}
