import React from "react";
import { Link } from 'react-router-dom';
import { IMessage } from "../../../redux/slices/interfaces/IMessage";

interface ChatPrivateNotificationProps {
    lastMessage: IMessage;
    setShowPrivateNotification: (value: boolean) => void;
  } 
export const ChatPrivateNotification: React.FC<ChatPrivateNotificationProps> = ({setShowPrivateNotification, lastMessage}) => {
  return (
    <div className="fixed bottom-10 left-20 p-[10px] bg-green-500 text-white flex flex-col rounded-xl">
      <Link
        to={`/private-chat/`}
        className="cursor-pointer"
        onClick={() => setShowPrivateNotification(false)}
      >
        <div>Новое личное сообщение!</div>
        <div>От пользователя: {lastMessage?.name}</div>
      </Link>
    </div>
  );
};

export default ChatPrivateNotification;
