import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store'
import Chat from "../chat";
import chatImage from '../../assets/image.svg'
import EventState from "./interfaces/iEventState";
import socketIOClient from 'socket.io-client';
import Logo from '../../assets/logo.svg'
import { addMessage } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from '../../redux/store/store'

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);
export const Root = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { events } = useSelector((state: { event: EventState }) => state.event);
  const [isChatOpen, setIsChatOpen] = React.useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  // const [messages, setMessages] = useState<{ name: string, id: string, text: string }[]>([]);
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const messages = useSelector((state: RootState) => state.auth.messages);
  const lastMessage = useSelector((state: RootState) => state.auth.messages[state.auth.messages.length - 1]);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }
  
  
  useEffect(() => {
    
    const handleMessage = (data: any) => {
      dispatch(addMessage(data))
    };
    socket.on('responce', handleMessage);
    socket.on('responce', () => {
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    });
    return () => {
      console.log('Stopping listening to chat message!');
      // socket.off('responce', handleMessage);
      socket.disconnect()
    };
  }, [dispatch]);
  // useEffect(() => {
  //   socket.on('responce', () => {
  //     setShowNotification(true);

  //     setTimeout(() => {
  //       setShowNotification(false);
  //     }, 5000);
  //   });
  // }, [socket]);
  // useEffect(() => {
  //   const handleEvent = () => {
  //     setShowNotification(true)
  //     console.log('new event!!');

  //   };
  console.log(messages);

  return (<div className="pl-[50px] bg-gradient-to-r from-teal-200 to-lime-200 pr-[50px] ">
    <div className="flex shadow-2xl shadow-white items-center">
      <img src={Logo} alt="" />

      <div className="text-2xl text-green-600 font-bold">EventMap</div>

      {isAuthenticated && (
        <>
          <NavLink className="pl-[50px] w-1/5" to="/">Главная страница</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/search-event">Поиск мероприятий</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/create-event">Создать мероприятие</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/detail-event">Мои мероприятия</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/user-profile">Профиль</NavLink>
        </>
      )}
      {!isAuthenticated && <div className="flex items-center justify-between w-[1300px]">
        <NavLink className="pl-[50px] w-1/5" to="/">Главная страница</NavLink>
        <NavLink className="pl-[50px] w-1/5" to="/user-profile">Войти</NavLink>
      </div>}
      {/* <NavLink className="pl-[50px] w-1/5" to="/user-profile">Войти</NavLink> */}
    </div>
    <div className="flex items-center justify-center mt-[50px] h-full w-full p-[20px]">

      <Outlet />
      {isAuthenticated && <div>
        <div onClick={handleToggleChat}>
          {!isChatOpen && <img className="fixed bottom-0 right-0 p-4" alt="chat" src={chatImage} />}
        </div>
        {isChatOpen && <div className="flex flex-col fixed bottom-0 right-0 p-4">
          <div className="cursor-pointer hover:text-white font-bold" onClick={handleToggleChat}>Свернуть чат</div>
          <div className="">
            <Chat />
          </div>
        </div>}
      </div>}
      {showNotification && (
        lastMessage.name === user?.userName ? ( null ) : (<div className="fixed bottom-10 left-20 p-[10px] bg-green-500 text-white flex flex-col rounded-xl">
        <div>
          Новое сообщение!
        </div>
        <div>
          От пользователя: {lastMessage.name}
        </div>
      </div>)
      )}
    </div>
  </div>)
}