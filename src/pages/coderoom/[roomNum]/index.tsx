import Editor from "@monaco-editor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClockLoader as Loader } from "react-spinners";

import io from "socket.io-client";
import Chat from "../../../components/coderoom/Chat";
import LanguageSelectionListbox from "../../../components/coderoom/LangaugeSelectionListbox";
import Question from "../../../components/coderoom/Question";
import StatusBar from "../../../components/coderoom/StatusBar";
import ThemeSelectionListbox from "../../../components/coderoom/ThemeSelectionListbox";

let socket: any;

const Room = () => {
    const [input, setInput] = useState("");

    const [currentLanguage, setCurrentLanguage] = useState("javascript");
    const [currentTheme, setCurrentTheme] = useState("vs-dark");

    const router = useRouter();
    const { roomNum } = router.query;
    useEffect(() => {
        socketInitializer();
    }, []);

    const socketInitializer = async () => {
        // Call default io
        await fetch("/api/matching/socket");
        socket = io();
        console.log(roomNum);
        socket.emit("join-room", roomNum);

        socket.on("receive-collab-edit", (message: any) => {
            setInput(message);
        });
    };

    function onChangeHandler(value: any, event: any) {
        setInput(value);
        console.log(socket);
        console.log(roomNum, value);
        socket.emit("collab-edit", roomNum, value);
    }

    return (
        <div className="dark:bg-black bg-light-100 dark:bg-opacity-20">
            <StatusBar roomNum={roomNum!} />

            <div className="p-2">
                <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1 dark:bg-dark-100 bg-white p-4 rounded-lg">
                        <Question />
                    </div>
                    <div className="col-span-3 min-h-screen dark:bg-dark-100 bg-white p-4 rounded-lg">
                        <div className="flex gap-6 items-center">
                            <div className="flex gap-1 items-center">
                                <p>Change language:</p>
                                <LanguageSelectionListbox setCurrentLanguage={setCurrentLanguage} />
                            </div>
                            <div className="flex gap-1 items-center">
                                <p>Change theme:</p>
                                <ThemeSelectionListbox setCurrentTheme={setCurrentTheme} />
                            </div>
                        </div>

                        <Editor
                            //height="600px" // By default, it fully fits with its parent
                            theme={currentTheme}
                            defaultLanguage="javascript"
                            language={currentLanguage}
                            loading={<Loader />}
                            value={input}
                            onChange={onChangeHandler}
                            className="h-screen mt-5"
                        />
                    </div>
                    <div className="col-span-1 dark:bg-dark-100 bg-white p-4 rounded-lg">
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
