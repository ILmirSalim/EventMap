import React from "react";
import { IMessage } from "../../../redux/slices/interfaces/IMessage";
import { UserProfile } from "../../../redux/slices/interfaces/IUserProfile";

interface ChatNotificationProps {
  lastMessage: IMessage;
  user: UserProfile | null;
}

export const ChatNotification: React.FC<ChatNotificationProps> = ({
  user,
  lastMessage,
}) => {
  return lastMessage?.name === user?.userName ? null : (
    <div className="fixed bottom-10 left-20 p-[10px] bg-green-500 text-white flex flex-col rounded-xl">
      <div>Новое сообщение в общем чате!</div>
      <div>От пользователя: {lastMessage.name}</div>
    </div>
  );
};

export default ChatNotification;
