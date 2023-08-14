import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store/store'
import 'react-toastify/dist/ReactToastify.css';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<{ name: string, id: string, text: string }[]>([]);
    const [message, setMessage] = useState<string>('');
    const [users, setUsers] = useState<{ id: string, name: string }[]>([])
    const [showNotification, setShowNotification] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user)

    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit('chat message', {
            text: message,
            name: user?.userName,
            id: `${socket.id}-${Math.random()}`,

        });
        setMessage('')
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    useEffect(() => {
        const handleMessage = (data: any) => {
            setMessages((prevMessages) => [...prevMessages, { name: data.name, text: data.text, id: data.id }])

        };

        socket.on('responce', handleMessage);

        return () => {
            console.log('Stopping listening to chat message!');
            // socket.off('responce', handleMessage);
            socket.disconnect()
        };
    }, []);


    return (
        <div className='h-[400px] w-[400px] bg-gradient-to-r 
        from-teal-200 to-lime-200 opacity-90 
        flex flex-col justify-end'>
            <ul className='flex-1 overflow-auto'>
                {messages && messages.map((message) =>
                    message ? (
                        message.name === user?.userName ? (
                            <div key={message.id} className="mt-[10px] ml-[200px] bg-gradient-to-r from-green-400 to-cyan-400 mb-[10px] rounded-xl mr-[5px]">
                                <div className='font-bold pl-[5px]'>Моё сообщение:</div>
                                <li className='pl-[5px]'>{message.text}</li>
                            </div>
                        ) : (
                            <div key={message.id}>
                                <div className='font-bold'>Пользователь: {message.name}</div>
                                <li>{message.text}</li>
                            </div>
                        )
                    ) : null
                )}
                {messages.length===0 && <>Пока нет сообщений...</>}
            </ul>
            <form onSubmit={sendMessage} className='mt-auto flex'>
                <input type="text" value={message} onChange={handleChange} className='w-full' />
                <button type="submit" className='hover:font-bold cursor-pointer outline-none'>Отправить сообщение</button>
            </form>
            {showNotification && <div className="p-[20px]">Получено новое сообщение</div>}
        </div>
    );
}

export default Chat