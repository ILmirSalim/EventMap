import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store/store'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user)
    
    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit('chat message', input);
        
        setInput('')
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        const handleMessage = (msg: string) => {
          setMessages((prevMessages) => [...prevMessages, msg]);  
          setShowNotification(true)         
        };
        
        socket.on('chat message', handleMessage);
        
        console.log('Listening to chat message!');
        
        return () => {
          console.log('Stopping listening to chat message!');
          socket.off('chat message', handleMessage);
        };
    }, []);

    useEffect(() => {
        if (showNotification) {
            const timeout = setTimeout(() => {
                setShowNotification(false); // Скрыть уведомление через 4 секунды
            }, 4000);

            return () => {
                clearTimeout(timeout);
            };
        }
       
    }, [showNotification]);
    return (
        <div className='h-48 bg-gradient-to-r from-teal-200 to-lime-200 opacity-90'>

            <ul>
                {messages.map((message, index) => (
                    <div>
                        <div className='font-bold'>Пользователь: {user?.userName}</div>
                        <li key={index}>{message}</li>
                    </div>

                ))}
            </ul>
            <form onSubmit={sendMessage} className=''>
                <input type="text" value={input} onChange={handleChange} className=''/>
                <button type="submit">Send</button>
            </form>
            {showNotification && <div className="p-[20px]">New message received</div>}
        </div>
    );
}

export default Chat