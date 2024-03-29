import React, { useEffect, useState } from "react";
import { addMessage, addPrivateMessage } from "../../redux/slices/userSlice";
import ChatPrivateNotification from "../Notifications/ChatPrivateNotification";
import ChatNotification from "../Notifications/ChatNotification";
import EventNotification from "../Notifications/EventNotification";
import { AppDispatch } from '../../redux/store/store'
import { RootState } from '../../redux/store/store'
import { Outlet, NavLink } from "react-router-dom";
import { Event } from "./interfaces/iEventState";
import socketIOClient from 'socket.io-client';
import chatImage from '../../assets/image.svg'
import { ENDPOINT } from "../../constants";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import Logo from '../../assets/logo.svg'
import Chat from "../chat";

const socket = socketIOClient(ENDPOINT);

export const Root = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [newEvent, setNewEvent] = useState<Event>();
  const [newUpdateEvent, setNewUpdateEvent] = useState<Event>();
  const [eventType, setEventType] = useState('');
  const [isChatOpen, setIsChatOpen] = React.useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showPrivateNotification, setShowPrivateNotification] = useState(false);
  const [eventNotification, setEventNotification] = useState(false);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const lastMessage = useSelector((state: RootState) => state.auth.messages[state.auth.messages.length - 1]);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }

  useEffect(() => {
    socket.on('response', (data) => {
      if (data.userId === user?.userName) {
        dispatch(addPrivateMessage(data))
        setShowPrivateNotification(true)
      } else {
        dispatch(addMessage(data))
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    });

    return () => {
      console.log('Stopping listening to response!');
      socket.off('response');
    };
  }, [dispatch, user?.userName]);

  useEffect(() => {
    const handleEvent = (event: any) => {
      setNewEvent(event)
      setEventType('newEvent');
      setEventNotification(true);

      setTimeout(() => {
        setEventNotification(false);
      }, 5000);

    };

    socket.on('responceEvent', handleEvent)
    return () => {
      console.log('Stopping listening to responceEvent!');
      socket.off('responceEvent', handleEvent);
    };
  }, []);

  useEffect(() => {
    const handleUpdateEvent = (updateEvent: any) => {
      setNewUpdateEvent(updateEvent)
      setEventType('updateEvent');
      setEventNotification(true);
      setTimeout(() => {
        setEventNotification(false);
      }, 5000);
    };
    socket.on('set update event', handleUpdateEvent)
    return () => {
      console.log('Stopping listening to responceEvent!');
      socket.off('set update event', handleUpdateEvent);
    };
  }, []);

  return (<div className="pl-[50px] bg-gradient-to-r from-teal-200 to-lime-200 pr-[50px] ">
    <div className="flex shadow-md shadow-white items-center">
      <img className="p-[10px]" src={Logo} alt="Logo" />
      <div className="text-2xl text-green-600 font-bold">EventMap</div>

      {isAuthenticated && (
        <div className="flex">
          <NavLink className="p-[10px] ml-[50px] flex items-center justify-center" to="/">Главное меню</NavLink>
          <NavLink className="p-[10px] ml-[50px]" to="/search-event">Поиск мероприятий</NavLink>
          <NavLink className="p-[10px] ml-[50px]" to="/create-event">Создать мероприятие</NavLink>
          <NavLink className="p-[10px] ml-[50px]" to="/detail-event">Мои мероприятия</NavLink>
          <NavLink className="p-[10px] ml-[50px] " to="/user-profile">Профиль</NavLink>
        </div>
      )}
      {!isAuthenticated && <div className="flex items-center justify-between w-[1300px]">
        <NavLink className=" ml-[50px] p-[10px] flex justify-center " to="/">Главная страница</NavLink>
        <NavLink className="p-[10px] mr-[50px] " to="/user-profile" title="Вход в учетную запись">Войти</NavLink>
      </div>}
    </div>
    <div className="flex items-center justify-center mt-[50px] h-full w-full p-[20px]">
      <Outlet />
      {isAuthenticated && <div>
        <div onClick={handleToggleChat}>
          {!isChatOpen && <div>
            <img className="fixed bottom-0 right-0 p-4" alt="chat" src={chatImage} />
          </div>
          }
        </div>
        {isChatOpen && <div className="flex flex-col fixed bottom-0 right-0 p-4">
          <div className="cursor-pointer hover:text-white font-bold ml-[500px]" 
          onClick={handleToggleChat}>Свернуть общий чат</div>
          <div className="">
            <Chat />
          </div>
        </div>}
      </div>}

      {showPrivateNotification && <ChatPrivateNotification 
      lastMessage={lastMessage}
      setShowPrivateNotification={setShowPrivateNotification}/>}

      {showNotification && ( <ChatNotification 
      lastMessage={lastMessage}
      user={user}/>
      )}
      
      {eventNotification && <EventNotification 
      eventType={eventType}
      newEvent={newEvent}
      newUpdateEvent={newUpdateEvent}/>}
    </div>
  </div>)
}