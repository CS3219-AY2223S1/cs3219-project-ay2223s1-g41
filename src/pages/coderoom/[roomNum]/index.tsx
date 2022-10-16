import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

import io from "socket.io-client";

const ip = require("ip");
let socket:any;

const Profile = () => {
    const [currentMsg, setCurrentMsg] = useState<String>("");
    const [input, setInput] = useState('')
    const router = useRouter()
    const { roomNum } = router.query
    useEffect(() => {socketInitializer()}, [])
        
    const socketInitializer = async () => {
        // Call default io
        await fetch("/api/matching/socket");
        socket = io();
        console.log(roomNum)
        socket.emit('join-room', roomNum);

        socket.on('receive-collab-edit', (message:any) => {
            setInput(message);
        })
    };

    const onChangeHandler = (e:any) => {
        setInput(e.target.value)
        
        console.log(socket);
        console.log(roomNum, e.target.value);

        socket.emit('collab-edit',roomNum, e.target.value)
    }

    return (
        <div>
            <p>RoomNum: {roomNum}</p>
            <input
                placeholder="Type something"
                value={input}
                onChange={onChangeHandler}
            />
        </div>

    )   
}

export default Profile