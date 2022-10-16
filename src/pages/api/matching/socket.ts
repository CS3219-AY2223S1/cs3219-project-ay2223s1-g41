import { Server } from "socket.io";

export default function SocketHandler(req: any, res: any) {
    // const onConnection = (socket: any) => {
    //     const createdMessage = (msg: any) => {
    //         socket.broadcast.emit("newIncomingMessage", msg);
    //     };
    //     socket.on("createdMessage", createdMessage);
    // };

    // // Define actions inside
    // io.on("connection", onConnection);

    // console.log("Setting up socket");
    // res.end();

    const randomFixedInteger = (length: number) => {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    };

    let stack: string[] = [];
    let room: string[] = [];

    if (res.socket.server.io) {
        console.log("Socket is already running");
    } else {
        console.log("Socket is initializing");
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log(socket.id);
            stack.push(socket.id);
            if (stack.length == 2) {
                // already two user waiting in the server
                let user1 = stack.pop();
                let user2 = stack.pop();

                // generate a unique 6 digit room number
                let randomRoom = randomFixedInteger(6).toString();
                while (room.includes(randomRoom)) {
                    randomRoom = randomFixedInteger(6).toString();
                }
                room.push(randomRoom);

                // add the two user to the same room
                if (user1 !== undefined && user2 !== undefined) {
                    console.log(user1, user2);
                    io.to([user1, user2]).emit("assign-room", randomRoom);
                }
            }

            socket.on("collab-edit", (room, message) => {
                socket.to(room).emit("receive-collab-edit", message);
            });

            socket.on("join-room", (room) => {
                socket.join(room);
            });
        });
    }
    res.end();
}
