import { useContext, useEffect, useRef, useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { RoomContext } from "../../pages/coderoom/[roomNum]";

export default function Chat({ chats, socketId }: { chats: Message[]; socketId: string | undefined }) {
    const [message, setMessage] = useState<string>("");
    const { socket, roomNum, session } = { ...useContext(RoomContext) };

    const handleSubmit = () => {
        message &&
            socket.emit(
                "send-message",
                roomNum,
                new Message({
                    id: socket.id,
                    senderName: session?.user?.email!,
                    message: message,
                })
            );
        setMessage("");
    };

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const textareaElement = textareaRef.current;
    useEffect(() => {
        let keysPressed: any = {};
        const enterListener = (event: KeyboardEvent) => {
            keysPressed[event.key] = true;
            if (keysPressed["Enter"] && Object.entries(keysPressed).length === 1) {
                event.preventDefault();
                handleSubmit();
            }
        };

        const keyUpListener = (event: KeyboardEvent) => {
            delete keysPressed[event.key];
        };

        if (textareaElement) {
            textareaElement.addEventListener("keydown", enterListener);
            textareaElement.addEventListener("keyup", keyUpListener);
        }
        return () => {
            if (textareaElement) {
                textareaElement.removeEventListener("keydown", enterListener);
                textareaElement.removeEventListener("keyup", keyUpListener);
            }
        };
    }, [textareaElement, handleSubmit]);

    return (
        <div className="col-span-1 dark:bg-dark-100 bg-white rounded-lg flex flex-col justify-between">
            <div className={`p-2 h-[545px] overflow-auto overflow-x-auto justify-between flex flex-col`}>
                <div className="font-bold text-xl">Chat</div>
                <div className="flex flex-col justify-center items-center"></div>

                <ChatFeed
                    //messages={[new Message({ id: 0, message: "hi", senderName: "me" }), new Message({ id: 0, message: "hi", senderName: "me" })]} // Array: list of message objects
                    messages={chats.map((chat) => new Message({ ...chat, id: chat.id === socketId ? 0 : 1 }))}
                    isTyping={false} // Boolean: is the recipient typing
                    hasInputField={false} // Boolean: use our input, or use your own
                    bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
                    // JSON: Custom bubble styles
                    bubbleStyles={{
                        text: {
                            fontSize: 15,
                        },
                        chatbubble: {
                            borderRadius: 5,
                            padding: 5,
                            wrap: true,
                        },
                    }}
                />
            </div>
            <div className="h-0.5 mb-2 f-full dark:bg-dark-200 bg-light-100" />

            <div className="flex">
                <textarea
                    ref={textareaRef}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }}
                    className="w-full break-words break-all h-40 dark:bg-dark-100 bg-white resize-none p-2 dark:text-light-100 text-dark-200 focus:outline-none"
                />
                <button
                    className="dark:bg-dark-200 opacity-80 h-fit px-2 py-1 hover:opacity-100 mr-1 mt-12 rounded-sm"
                    onClick={() => handleSubmit()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
