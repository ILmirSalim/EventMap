import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store'
import Chat from "../RegistrationUser/components/chat";
import chatImage from '../../images/image.svg'
import EventState from "./interfaces/iEventState";
import socketIOClient from 'socket.io-client';
import Logo from '../../images/logo.svg'

export const Root = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { events } = useSelector((state: { event: EventState }) => state.event);
  const [isChatOpen, setIsChatOpen] = React.useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);

  const ENDPOINT = 'http://localhost:3002';
  const socket = socketIOClient(ENDPOINT);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }
  useEffect(() => {
    socket.on('event added', () => {
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    });
  }, [socket]);
  // useEffect(() => {
  //   const handleEvent = () => {
  //     setShowNotification(true)
  //     console.log('new event!!');
      
  //   };

  //   socket.on('create event', handleEvent);
  //   console.log('Listening to events!');

  //   return () => {
  //     console.log('Stopping listening events!');
  //     socket.off('create event', handleEvent);
  //   };
  // }, [showNotification, socket]);

  // useEffect(() => {
  //   if (showNotification) {
  //     const timeout = setTimeout(() => {
  //       setShowNotification(false);
  //     }, 10000);

  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [showNotification]);

 
  return (<div className="pl-[50px] bg-gradient-to-r from-teal-200 to-lime-200 pr-[50px] ">
    <div className="flex shadow-2xl shadow-white items-center">
      <img src={Logo} alt="" />
      
      <div className="text-2xl text-green-600 font-bold">EventMap</div>
      
      {user && (
        <>
          <NavLink className="pl-[50px] w-1/5" to="/">Главная страница</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/search-event">Поиск мероприятий</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/create-event">Создать мероприятие</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/detail-event">Мои мероприятия</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/user-profile">Профиль</NavLink>
        </>
      )}
      {!user && <div className="flex items-center justify-between w-[1300px]">
        <NavLink className="pl-[50px] w-1/5" to="/">Главная страница</NavLink>
        <NavLink className="pl-[50px] w-1/5" to="/user-profile">Войти</NavLink>
        </div>}
      {/* <NavLink className="pl-[50px] w-1/5" to="/user-profile">Войти</NavLink> */}
    </div>
    <div className="flex items-center justify-center mt-[50px] h-full w-full p-[20px]">

      <Outlet />
      <div onClick={handleToggleChat}>
        {!isChatOpen && <img className="fixed bottom-0 right-0 p-4" alt="chat" src={chatImage} />}
      </div>
      {isChatOpen && <div className="flex flex-col fixed bottom-0 right-0 p-4">
        <div onClick={handleToggleChat}>Свернуть чат</div>
        <div className="">
          <Chat />
        </div>
      </div>}
      {showNotification && (
        <div style={{ position: 'fixed', bottom: 20, left: 20, padding: 10, background: 'green', color: 'white' }}>
          Событие успешно добавлено!
          
        </div>
      )}
    </div>
  </div>)
}