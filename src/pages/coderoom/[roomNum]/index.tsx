import Editor from '@monaco-editor/react';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { ClockLoader as Loader } from "react-spinners";

import io from "socket.io-client";

let socket:any;

const Profile = () => {
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

    function onChangeHandler(value:any, event:any){
        setInput(value)
        console.log(socket);
        console.log(roomNum, value);
        socket.emit('collab-edit',roomNum, value)
    }

    return (
        <div>
            <p>RoomNum: {roomNum}</p>
            <Editor
                height="600px" // By default, it fully fits with its parent
                theme="vs-dark"
                language="python"
                loading={<Loader />}
                value={input}
                onChange={onChangeHandler}
            />
        </div>

    )   
}

export default Profile