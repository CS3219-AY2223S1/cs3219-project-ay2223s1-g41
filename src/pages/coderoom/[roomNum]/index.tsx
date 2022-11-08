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

let socket: any;

export const RoomContext = createContext<
  { socket: any; roomNum: string | string[]; session: Session } | undefined
>(undefined);

const Room = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<Message[]>([]);

  const [questionNumber, setQuestionNumber] = useState<Number>(0);
  const [difficulty, setDifficulty] = useState<undefined | string>(undefined);

  const [questionDescription, setQuestionDescription] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionExamples, setQuestionExamples] = useState<object[]>(
    Object(undefined)
  );
  const [questionTests, setQuestionTests] = useState<object[]>(
    Object(undefined)
  );
  const [questionType, setQuestionType] = useState<string[]>([]);

  const router = useRouter();
  const { roomNum } = router.query;

  const { data: session } = useSession();

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    if (questionNumber !== 0 && difficulty !== undefined) {
      getQuestion();
    }
  }, [questionNumber, difficulty]);

  const socketInitializer = async () => {
    // Call default io
    await fetch("/api/matching/socket");
    socket = io();
    socket.emit("join-room", roomNum);

    socket.on("receive-collab-edit", (message: any) => {
      setInput(message);
    });

    socket.on("message-received", (allChats: Message[]) => {
      setChats(allChats);
    });

    socket.on("questionNumber", (qnNumber: Number) => {
      setQuestionNumber(qnNumber);
    });

    socket.on("difficulty", (difficulty: string) => {
      setDifficulty(difficulty);
    });
  };

  const getQuestion = async () => {
    try {
      await axios
        .get(`../api/questions/${difficulty}/${questionNumber}`)
        .then((res) => {
          const question = res.data.question;
          setQuestionName(question.name);
          setQuestionDescription(question.description);
          setQuestionDifficulty(question.difficulty);
          setQuestionExamples(question.examples);
          setQuestionTests(question.tests);
          setQuestionType(question.type);
        });
    } catch (err) {
      console.log(err);
    }
  };

  function onChangeHandler(value: any, event: any) {
    setInput(value);
    socket.emit("collab-edit", roomNum, value);
  }

  return (
    <RoomContext.Provider
      value={{ socket: socket, roomNum: roomNum!, session: session! }}
    >
      <div className="dark:bg-black bg-light-100 dark:bg-opacity-20 overflow-y-hidden">
        <StatusBar />
        <div className="p-2">
          <div className="grid grid-cols-5 gap-2 pt-20">
            <Question
              questionDescription={questionDescription}
              questionName={questionName}
              questionDifficulty={questionDifficulty}
            />
            <EditorAndConsole input={input} onChangeHandler={onChangeHandler} />
            <Chat chats={chats} socketId={socket && socket.id} />
          </div>
        </div>
      </div>
    </RoomContext.Provider>
  );
};

export default Room;
