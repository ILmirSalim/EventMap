import React, { useState, useEffect, useCallback } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store/store'
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);

interface IUserOnlain {
    user: string,
    socketID: string;
}
const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [usersData, setUsersData] = useState<IUserOnlain[]>([])
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch: AppDispatch = useDispatch<AppDispatch>()
    const messages = useSelector((state: RootState) => state.auth.messages)
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const sendMessage = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit('chat message', {
            text: message,
            name: user?.userName,
            id: `${socket.id}-${uuidv4()}`,
            // Передаем ID получателя на сервер
            socketID: socket.id
        });
        setMessage('');
    }, [message, user?.userName,]);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };
    useEffect(() => {

        socket.emit('newUser', { user: user?.userName, socketID: socket.id })

        socket.on('responseNewUser', (data: IUserOnlain[]) => {
            const uniqueUsersData: IUserOnlain[] = data.reduce((acc, curr) => {
                // Добавляем проверку на наличие значения curr перед выполнением сравнения
                if (curr && curr.user) {
                    // Проверяем, есть ли уже объект с таким именем в аккумуляторе
                    const existingUser = acc.find((user: IUserOnlain) => user.user === curr.user);
                    // Если объект с таким именем уже существует, не добавляем его в аккумулятор
                    if (!existingUser) {
                        acc.push(curr as never);
                    }
                }
                return acc;
            }, []);

            setUsersData(uniqueUsersData);
        });
        socket.on('disconnect', () => {
            setUsersData((prevUsersData) => {
                return prevUsersData.filter((userData) => userData.socketID !== socket.id);
            });
        });


    }, [user?.userName,]);

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
            <ul>
                {usersData.map((userData) => (
                    <li key={userData.socketID}>
                        ID: {userData.socketID}, Имя: {userData.user}
                    </li>
                ))}
            </ul>

            <form onSubmit={sendMessage} className='mt-auto flex flex-col'>
                <input type="text" value={message} onChange={handleChange} className='w-full' placeholder='Введите сообщение' />
                {/* <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className='w-full mt-[10px]' placeholder='ID получателя' /> */}
                <button type="submit" className='hover:font-bold cursor-pointer outline-none'>Отправить сообщение</button>
            </form>
        </div>
    );
}

export default Chat;