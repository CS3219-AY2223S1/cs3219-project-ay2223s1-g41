import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

import io from "socket.io-client";
import Chat from "../../../components/coderoom/Chat";
import Question from "../../../components/coderoom/Question";
import StatusBar from "../../../components/coderoom/StatusBar";

import { Message } from "react-chat-ui";
import { Session } from "next-auth";
import EditorAndConsole from "../../../components/coderoom/EditorAndConsole";
import axios from "axios";
import { QuestionType } from "../../../../peerprep";

let socket: any;

export const RoomContext = createContext<{ socket: any; roomNum: string | string[]; session: Session } | undefined>(undefined);

const Room = () => {
    const router = useRouter();
    const { roomNum } = router.query;
    const [input, setInput] = useState("");
    const [syncInput, setSyncInput] = useState("");
    const [isSynced, setIsSynced] = useState(false);
    const [chats, setChats] = useState<Message[]>([]);

    const [questionNumber, setQuestionNumber] = useState<number | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

    const [question, setQuestion] = useState<QuestionType | undefined>(undefined);

    const { data: session } = useSession();

    useEffect(() => {
        socketInitializer();
    }, []);

    useEffect(()=> {
        if (!isSynced) { // if my change
            console.log("mychange")
            socket?.emit("collab-edit", roomNum, input, socket.id);
        } else {
            setIsSynced(!isSynced);
        }
    }, [input]);

    useEffect(() => {
        if (questionNumber !== undefined && difficulty !== undefined) {
            console.log("get question");
            getQuestion();
        }
    }, [questionNumber, difficulty]);

    const socketInitializer = async () => {
        // Call default io
        await fetch("/api/matching/socket");
        socket = io();
        socket.emit("join-room", roomNum);

        socket.on("receive-collab-edit", (message: any, socketId: any) => {
            if (socketId !== socket.id) {
                console.log("receive changes from", socketId, "To", socket.id);
                setIsSynced(true);
                setInput(message);
            }
        });

        socket.on("message-received", (allChats: Message[]) => {
            setChats(allChats);
        });

        socket.on("questionNumber", (qnNumber: number) => {
            setQuestionNumber(qnNumber);
        });

        socket.on("difficulty", (difficulty: string) => {
            setDifficulty(difficulty);
        });
    };

    const getQuestion = async () => {
        try {
            await axios.get(`../api/questions/${difficulty}/${questionNumber}`).then((res) => {
                const question = res.data.question;
                console.log(question);
                setQuestion(question);
            });
        } catch (err) {
            console.log(err);
        }
    };

    function onChangeHandler(value: any, event: any) {
        setInput(value);
    }

    return (
        <RoomContext.Provider value={{ socket: socket, roomNum: roomNum!, session: session! }}>
            <div className="dark:bg-black bg-light-100 dark:bg-opacity-20 h-screen overflow-hidden">
                <StatusBar />
                <div className="grid grid-cols-5 gap-2 py-20 p-2 mt-2 h-full">
                    <Question question={question} />
                    <EditorAndConsole input={input} onChangeHandler={onChangeHandler} />
                    <Chat chats={chats} socketId={socket && socket.id} />
                </div>
            </div>
        </RoomContext.Provider>
    );
};

export default Room;
