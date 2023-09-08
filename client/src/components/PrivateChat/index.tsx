import React, { useState, useEffect, useCallback } from 'react';
import socketIOClient from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store'
import { v4 as uuidv4 } from 'uuid';
import { chatWrapper } from './style';
import { IUserOnlain } from './interface/IUserOnlain';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);

const PrivateChat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [usersData, setUsersData] = useState<IUserOnlain[]>([])
    const [recipient, setRecipient] = useState('')
    const user = useSelector((state: RootState) => state.auth.user)
    const privateMessages = useSelector((state: RootState) => state.auth.privateMessages)

    const sendMessage = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentTime = new Date();
        socket.emit('chat message', {
            text: message,
            name: user?.userName,
            id: `${socket.id}-${uuidv4()}`,
            userId: recipient,
            socketID: socket.id,
            time: currentTime.toISOString()
        });
        setMessage('');
    }, [message, user?.userName, recipient]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    useEffect(() => {
        socket.emit('newUser', { user: user?.userName, socketID: socket.id, email: user?.email })

        socket.on('responseNewUser', (data: IUserOnlain[]) => {
            const uniqueUsersData: IUserOnlain[] = data.reduce((acc, curr) => {
                // Добавляем проверку на наличие значения curr перед выполнением сравнения
                if (curr && curr.user) {
                    // Проверяем, есть ли уже объект с таким именем в асс
                    const existingUser = acc.find((user: IUserOnlain) => user.email === curr.email);
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
    }, [user?.userName, user?.email]);

    return (
        <div className={chatWrapper}>
            <span className='font-bold p-[5px]'>Написать личное сообщение пользователю:</span>
            <div className="flex flex-row h-full">
                <ul className="flex-1 h-[300px] overflow-auto border-r-2 border-white">
                    {privateMessages && privateMessages.map((message) =>
                        message.name === user?.userName ? (
                            <div key={message.id + Math.random()} className="mt-[10px] ml-[200px] bg-green-500 mb-[10px] 
                            rounded-xl mr-[5px]">
                                <div className='font-bold pl-[5px]'>Я:</div>
                                <li className='pl-[5px]'>{message.text}</li>
                            </div>
                        ) : (
                            <div key={message.id} className='mt-[10px] ml-[5px] bg-white border-white border rounded-xl 
                            w-1/2 p-[5px] bg-white '>
                                <div className='fo nt-bold'>Сообщение от {message.name}:</div>
                                <li>{message.text}</li>
                                <li className='text-[10px]'>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</li>
                            </div>
                        )
                    )}
                    {privateMessages.length === 0 && <div className='ml-[100px] mt-[20px]'>Пока нет сообщений...</div>}
                </ul>

                <div className='pl-[5px] h-full border-l-2 border-white  overflow-auto w-1/3'>
                    <p className='font-bold'>Выберите, кому хотите отправить сообщение:</p>
                    {usersData.map((userData) => (
                        <li className='flex justify-center' key={userData.socketID}>
                            <span onClick={() => setRecipient(userData.user)}
                                className='cursor-pointer p-[3px] hover:font-bold hover:text-green-600'>
                                {userData.user} ({userData.email})
                            </span>
                        </li>
                    ))}
                </div>
            </div>

            <form onSubmit={sendMessage} className='mt-auto flex flex-col'>
                <input type="text"
                    value={message}
                    onChange={handleChange}
                    className='w-full ml-[10px] pl-[20px]'
                    placeholder='Введите сообщение' />
                <input type="text" value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className='ml-[10px] pl-[20px] w-full mt-[10px]'
                    placeholder='Кликните по имени пользователя' />
                <button type="submit"
                    className='border-white mt-[10px] hover:font-bold cursor-pointer outline-none'>
                    Отправить личное сообщение
                </button>
            </form>
        </div>
    );
}

export default PrivateChat;