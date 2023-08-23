import React, { useState, useEffect, useCallback } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store/store'
import 'react-toastify/dist/ReactToastify.css';
import { log } from 'console';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);
interface Message {
    text: string;
    name: string;
    id: string;
}
const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [showNotification, setShowNotification] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch: AppDispatch = useDispatch<AppDispatch>()
    const messages = useSelector((state: RootState) => state.auth.messages)
    
    const sendMessage = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit('chat message', {
            text: message,
            name: user?.userName,
            id: `${socket.id}-${Math.random()}`,
        });
        setMessage('');
    }, [message, user?.userName,]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    // useEffect(() => {
    //     const handleMessage = (data: any) => {
    //         setMessages((prevMessages) => [...prevMessages, { name: data.name, text: data.text, id: data.id }])

    //     };

    //     socket.on('responce', handleMessage);

    //     return () => {
    //         console.log('Stopping listening to chat message!');
    //         // socket.off('responce', handleMessage);
    //         socket.disconnect()
    //     };
    // }, []);

    return (
        <div className='h-[400px] w-[400px] bg-gradient-to-r 
        from-teal-200 to-lime-200 opacity-90 
        flex flex-col justify-end'>
            <ul className='flex-1 overflow-auto'>
                {messages && messages.map((message) =>
                    message.name === user?.userName ? (
                        <div key={message.id} className="mt-[10px] ml-[200px] bg-white mb-[10px] rounded-xl mr-[5px]">
                            <div className='font-bold pl-[5px]'>Я:</div>
                            <li className='pl-[5px]'>{message.text}</li>
                        </div>
                    ) : (
                        <div key={message.id} className='ml-[5px] border-white border rounded-xl w-1/2 p-[5px] bg-white '>
                            <div className='font-bold'>{message.name}:</div>
                            <li>{message.text}</li>
                        </div>
                    )
                )}
                {messages.length === 0 && <>Пока нет сообщений...</>}
            </ul>
            <form onSubmit={sendMessage} className='mt-auto flex'>
                <input type="text" value={message} onChange={handleChange} className='w-full' />
                <button type="submit" className='hover:font-bold cursor-pointer outline-none'>Отправить сообщение</button>
            </form>
        </div>
    );
}

export default Chat;