import React, { useState, useEffect, useCallback } from 'react';
import { addMessage, addPrivateMessage } from "../../redux/slices/userSlice"
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store/store'
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { chatWrapper } from './style';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);

interface IUserOnlain {
    user: string,
    socketID: string;
}
const PrivateChat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [usersData, setUsersData] = useState<IUserOnlain[]>([])
    const [recipient, setRecipient] = useState('')
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch: AppDispatch = useDispatch<AppDispatch>()
    const messages = useSelector((state: RootState) => state.auth.messages)
    const privateMessages = useSelector((state: RootState) => state.auth.privateMessages)
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
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
    // useEffect(() => {

    //     socket.emit('newUser', { user: user?.userName, socketID: socket.id })

    //     socket.on('responseNewUser', (data: IUserOnlain[]) => {
    //         const uniqueUsersData: IUserOnlain[] = data.reduce((acc, curr) => {
    //             // Добавляем проверку на наличие значения curr перед выполнением сравнения
    //             if (curr && curr.user) {
    //                 // Проверяем, есть ли уже объект с таким именем в асс
    //                 const existingUser = acc.find((user: IUserOnlain) => user.user === curr.user);
    //                 // Если объект с таким именем уже существует, не добавляем его в аккумулятор
    //                 if (!existingUser) {
    //                     acc.push(curr as never);
    //                 }
    //             }
    //             return acc;
    //         }, []);

    //         setUsersData(uniqueUsersData);
    //     });
    //     socket.on('disconnect', () => {
    //         setUsersData((prevUsersData) => {
    //             return prevUsersData.filter((userData) => userData.socketID !== socket.id);
    //         });
    //     });

    // }, [user?.userName,]);

    useEffect(() => {


        socket.on('response', (data) => {
            if (data.userId === user?.userName) {
                dispatch(addPrivateMessage(data))
            }
        });

        // const allMessages = [...messages, ...privateMessages];

        // const sortedMessages = allMessages.sort((a, b) => {
        //     const timeA = new Date(a.time);
        //     const timeB = new Date(b.time);
        //     return timeA.getTime() - timeB.getTime();
        // });
        // allMessages.sort((a, b) => +a.time - +b.time);
    // console.log('allMessages',  sortedMessages);
        return () => {
            console.log('Stopping listening to response!');
            socket.off('response');
        };
    }, [dispatch, user?.userName, privateMessages]);
    console.log('privateMessages', privateMessages);

    return (
        <div className={chatWrapper}>
            <div className="flex flex-row h-full">
                <ul className="flex-1 h-[300px] overflow-auto border-r-2 border-white">
                    {/* {messages && messages.map((message) =>
                        message.name === user?.userName ? (
                            <div key={message.id} className="mt-[10px] ml-[200px] bg-white mb-[10px] 
                            rounded-xl mr-[5px]">
                                <div className='font-bold pl-[5px]'>Я:</div>
                                <li className='pl-[5px]'>{message.text}</li>
                            </div>
                        ) : (
                            <div key={message.id} className='ml-[5px] border-white border rounded-xl 
                            w-1/2 p-[5px] bg-white '>
                                <div className='font-bold'>{message.name}:</div>
                                <li>{message.text}</li>
                            </div>
                        )
                    )} */}
                    {privateMessages && privateMessages.map((message) =>
                        message.name === user?.userName ? (
                            <div key={message.id + Math.random()} className="mt-[10px] ml-[200px] bg-green-500 mb-[10px] 
                            rounded-xl mr-[5px]">
                                <div className='font-bold pl-[5px]'>Я:</div>
                                <li className='pl-[5px]'>{message.text}</li>
                            </div>
                        ) : (
                            <div key={message.id + Math.random()} className='mt-[10px] ml-[5px] bg-green-700 border-white border rounded-xl 
                            w-1/2 p-[5px] bg-white '>
                                <div className='fo nt-bold'>Личное сообщение от: {message.name}:</div>
                                <li>{message.text}</li>
                            </div>
                        )
                    )}
                    {privateMessages.length === 0 && <div className='ml-[100px] mt-[20px]'>Пока нет сообщений...</div>}
                </ul>

                <div className='pl-[5px] h-full border-l-2 border-white  overflow-auto'>
                    <p>Личный чат с пользователем:</p>
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
                    placeholder='ID получателя(кликните по имени пользователя)' />
                <button type="submit"
                    className='mt-[10px] hover:font-bold cursor-pointer outline-none'>
                    Отправить сообщение
                </button>
            </form>
        </div>
    );
}

export default PrivateChat;