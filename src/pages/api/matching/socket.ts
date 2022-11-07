import { Server } from "socket.io";

let chatsOfAllRooms: any = {};

export default function SocketHandler(req: any, res: any) {
    const randomFixedInteger = (length: number) => {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    };

    let stack: string[] = [];
    let room: string[] = [];
    let accepts: string[] = [];

    let user1: string | undefined;
    let user2: string | undefined;

    if (res.socket.server.io) {
        console.log("Socket is already running");
    } else {
        console.log("Socket is initializing");
        const io: Server = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", async (socket) => {
            console.log(socket.id + " is connected");
            if (!stack.includes(socket.id)) {
                stack.push(socket.id);
            }
            if (stack.length == 2) {
                // already two user waiting in the server
                user1 = stack.pop()!;
                user2 = stack.pop()!;
            }

            // notify both users that a match is found
            if (user1 && user2) {
                console.log("match-found");
                console.table({ user1, user2 });
                io.to([user1, user2]).emit("match-found");
            }

            socket.on("decline", (socketId) => {
                console.log(socketId + " declined");
                io.to(user1 === socketId ? user2! : user1!).emit("other-declined");
                // user1 = undefined;
                // user2 = undefined;
                // accepts = [];
            });

            //if (user1 && user2) {
            socket.on("accept", (socketId) => {
                accepts.push(socketId);
                console.log(socketId + " accepted");

                if (accepts.length === 2) {
                    // generate a unique 6 digit room number
                    let randomRoom = randomFixedInteger(6).toString();
                    while (room.includes(randomRoom)) {
                        randomRoom = randomFixedInteger(6).toString();
                    }
                    room.push(randomRoom);

                    // after both users have accepted, assign room number
                    io.to([user1!, user2!]).emit("assign-room", randomRoom);
                    user1 = undefined;
                    user2 = undefined;
                    accepts = [];
                }
            });
            // }

            socket.on("collab-edit", (room, message) => {
                socket.to(room).emit("receive-collab-edit", message);
            });

            socket.on("send-message", (room: string, message: { sender: string; time: Date; message: string }) => {
                console.log(message);
                if (!chatsOfAllRooms[room]) {
                    chatsOfAllRooms[room] = [];
                }
                chatsOfAllRooms[room].push(message);
                console.log(chatsOfAllRooms);
                socket.to(room).emit("message-received", chatsOfAllRooms[room]);
            });

            socket.on("join-room", (room) => {
                socket.join(room);
            });
        });
    }
    res.end();
}
