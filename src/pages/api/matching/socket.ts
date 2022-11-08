import { randomInt } from "crypto";
import { Server } from "socket.io";

let chatsOfAllRooms: any = {};

export default function SocketHandler(req: any, res: any) {
    const randomFixedInteger = (length: number) => {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    };
    const QN_COUNT = 5;
    const randomQnNumber = randomInt(1, QN_COUNT + 1);

    let easyQ: (string | undefined)[] = [];
    let mediumQ: (string | undefined)[] = [];
    let hardQ: (string | undefined)[] = [];

    let room: string[] = [];
    let accepts: string[] = [];

    let user1: string | undefined;
    let user2: string | undefined;
    let difficulty: string | undefined;

    if (res.socket.server.io) {
        console.log("Socket is already running");
    } else {
        console.log("Socket is initializing");
        const io: Server = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", async (socket) => {
            console.log(socket.id + " is connected");
            // notify both users that a match is found
            socket.on("find-match", (selectedDifficulties) => {
                console.log("start finding!!!");
                let temp: string[] = [];
                for (let index = 0; index < selectedDifficulties.length; index++) {
                    temp.push(selectedDifficulties[index].difficulty);
                }

                console.log(temp);
                if (temp.includes("Easy")) {
                    easyQ.push(socket.id);
                }
                if (temp.includes("Medium")) {
                    mediumQ.push(socket.id);
                }
                if (temp.includes("Hard")) {
                    hardQ.push(socket.id);
                }

                // check if any one queue meet 2 ppl, remove the users from all queue
                if (easyQ.length == 2) {
                    user1 = easyQ.shift()!;
                    user2 = easyQ.shift()!;
                    difficulty = "easy";
                    if (mediumQ.includes(user1)) {
                        mediumQ.splice(mediumQ.indexOf(user1), 1);
                    }
                    if (mediumQ.includes(user2)) {
                        mediumQ.splice(mediumQ.indexOf(user2), 1);
                    }
                    if (hardQ.includes(user1)) {
                        hardQ.splice(hardQ.indexOf(user1), 1);
                    }
                    if (hardQ.includes(user2)) {
                        hardQ.splice(hardQ.indexOf(user2), 1);
                    }
                }

                if (mediumQ.length == 2) {
                    user1 = mediumQ.shift()!;
                    user2 = mediumQ.shift()!;
                    difficulty = "medium";
                    if (easyQ.includes(user1)) {
                        easyQ.splice(easyQ.indexOf(user1), 1);
                    }
                    if (easyQ.includes(user2)) {
                        easyQ.splice(easyQ.indexOf(user2), 1);
                    }
                    if (hardQ.includes(user1)) {
                        hardQ.splice(hardQ.indexOf(user1), 1);
                    }
                    if (hardQ.includes(user2)) {
                        hardQ.splice(hardQ.indexOf(user2), 1);
                    }
                }

                if (hardQ.length == 2) {
                    user1 = hardQ.shift()!;
                    user2 = hardQ.shift()!;
                    difficulty = "hard";
                    if (mediumQ.includes(user1)) {
                        mediumQ.splice(mediumQ.indexOf(user1), 1);
                    }
                    if (mediumQ.includes(user2)) {
                        mediumQ.splice(mediumQ.indexOf(user2), 1);
                    }
                    if (easyQ.includes(user1)) {
                        easyQ.splice(easyQ.indexOf(user1), 1);
                    }
                    if (easyQ.includes(user2)) {
                        easyQ.splice(easyQ.indexOf(user2), 1);
                    }
                }

                if (user1 && user2) {
                    console.log("match-found");
                    console.table({ user1, user2 });
                    io.to([user1, user2]).emit("match-found");
                }
            });

            socket.on("cancel-find-match", (socketId) => {
                console.log("should disconnect soon");
                if (easyQ.includes(socket.id)) {
                    easyQ.splice(easyQ.indexOf(socket.id));
                }
                if (mediumQ.includes(socket.id)) {
                    mediumQ.splice(mediumQ.indexOf(socket.id));
                }
                if (hardQ.includes(socket.id)) {
                    hardQ.splice(hardQ.indexOf(socket.id));
                }
            });

            socket.on("decline", (socketId) => {
                console.log(socketId + " declined");
                io.to(user1 === socketId ? user2! : user1!).emit("other-declined");
                if (easyQ.includes(user1)) {
                    easyQ.splice(easyQ.indexOf(user1));
                }
                if (mediumQ.includes(user1)) {
                    mediumQ.splice(mediumQ.indexOf(user1));
                }
                if (hardQ.includes(user1)) {
                    hardQ.splice(hardQ.indexOf(user1));
                }

                if (easyQ.includes(user2)) {
                    easyQ.splice(easyQ.indexOf(user2));
                }
                if (mediumQ.includes(user2)) {
                    mediumQ.splice(mediumQ.indexOf(user2));
                }
                if (hardQ.includes(user2)) {
                    hardQ.splice(hardQ.indexOf(user2));
                }
                user1 = undefined;
                user2 = undefined;
                accepts = [];
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
                socket.to(room).emit("questionNumber", randomQnNumber);
                //console.log(difficulty);
                socket.to(room).emit("difficulty", difficulty);
            });
        });
    }
    res.end();
}
