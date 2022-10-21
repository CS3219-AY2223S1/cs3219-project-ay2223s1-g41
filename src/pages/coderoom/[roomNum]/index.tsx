import Editor from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { ClockLoader as Loader } from "react-spinners";

import io from "socket.io-client";
import Chat from "../../../components/coderoom/Chat";
import LanguageSelectionListbox from "../../../components/coderoom/LangaugeSelectionListbox";
import Question from "../../../components/coderoom/Question";
import StatusBar from "../../../components/coderoom/StatusBar";
import ThemeSelectionListbox from "../../../components/coderoom/ThemeSelectionListbox";
import useWindowDimensions from "../../../utils/useWindowDimension";

import { Message } from "react-chat-ui";
import { Session } from "next-auth";

let socket: any;

export const RoomContext = createContext<{ socket: any; roomNum: string | string[]; session: Session } | undefined>(undefined);

const Room = () => {
    const [input, setInput] = useState("");

    const [currentLanguage, setCurrentLanguage] = useState("javascript");
    const [currentTheme, setCurrentTheme] = useState("vs-dark");

    const [message, setMessage] = useState<string>("");
    const [chats, setChats] = useState<Message[]>([]);

    const router = useRouter();
    const { roomNum } = router.query;

    const { data: session } = useSession();

    useEffect(() => {
        socketInitializer();
    }, []);

    const socketInitializer = async () => {
        // Call default io
        await fetch("/api/matching/socket");
        socket = io();
        //console.log(roomNum);
        socket.emit("join-room", roomNum);

        socket.on("receive-collab-edit", (message: any) => {
            //console.log(message);
            setInput(message);
        });

        socket.on("message-received", (allChats: Message[]) => {
            setChats(allChats);
        });
    };

    function onChangeHandler(value: any, event: any) {
        setInput(value);
        //console.log(socket);
        //console.log(roomNum, value);
        socket.emit("collab-edit", roomNum, value);
    }

    const { height } = useWindowDimensions();

    return (
        <RoomContext.Provider value={{ socket: socket, roomNum: roomNum!, session: session! }}>
            <div className="dark:bg-black bg-light-100 dark:bg-opacity-20 overflow-y-hidden">
                <StatusBar />
                <div className="p-2">
                    <div className="grid grid-cols-5 gap-2 pt-20">
                        <Question />
                        <div className="col-span-3 dark:bg-dark-100 bg-white p-4 rounded-lg container">
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
                                height={`${height! - 235}px`}
                                theme={currentTheme}
                                defaultLanguage="javascript"
                                language={currentLanguage}
                                loading={<Loader />}
                                value={input}
                                onChange={onChangeHandler}
                                className="mt-5"
                            />
                        </div>

                        <Chat chats={chats} socketId={socket && socket.id} />
                    </div>
                </div>
            </div>
        </RoomContext.Provider>
    );
};

export default Room;
