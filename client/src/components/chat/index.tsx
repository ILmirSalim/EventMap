import React, { useState, useEffect, useCallback } from "react";
import socketIOClient from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { chatWrapper } from "./style";
import { Link } from "react-router-dom";
import { ENDPOINT } from "../../constants";
import { IUserOnlain } from "./interface";

const socket = socketIOClient(ENDPOINT);

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [usersData, setUsersData] = useState<IUserOnlain[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const messages = useSelector((state: RootState) => state.auth.messages);

  const sendMessage = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const currentTime = new Date();
      socket.emit("chat message", {
        text: message,
        name: user?.userName,
        user: user?.email,
        id: `${socket.id}-${uuidv4()}`,
        socketID: socket.id,
        time: currentTime.toISOString(),
      });
      setMessage("");
    },
    [message, user?.userName, user?.email]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    socket.emit("newUser", {
      user: user?.userName,
      socketID: socket.id,
      email: user?.email,
    });
    socket.on("responseNewUser", (data: IUserOnlain[]) => {
      const uniqueUsersData: IUserOnlain[] = data.reduce((acc, curr) => {
        // Добавляем проверку на наличие значения curr перед выполнением сравнения
        if (curr && curr.user) {
          // Проверяем, есть ли уже объект с таким именем в асс
          const existingUser = acc.find(
            (user: IUserOnlain) => user.email === curr.email
          );
          // Если объект с таким именем уже существует, не добавляем его в аккумулятор
          if (!existingUser) {
            acc.push(curr as never);
          }
        }
        return acc;
      }, []);
      setUsersData(uniqueUsersData);
    });
    socket.on("disconnect", () => {
      setUsersData((prevUsersData) => {
        return prevUsersData.filter(
          (userData) => userData.socketID !== socket.id
        );
      });
    });
  }, [user?.userName, user?.email]);

  return (
    <div className={chatWrapper}>
      <div className="flex flex-row h-full">
        <ul className="flex-1 h-[300px] overflow-auto border-r-2 border-white">
          {messages &&
            messages.map((message) =>
              message.name === user?.userName ? (
                <div
                  key={message.id}
                  className="mt-[10px] ml-[200px] bg-white mb-[10px] 
                  rounded-xl mr-[5px]">
                  <div className="font-bold pl-[5px]">Я:</div>
                  <li className="pl-[5px]">{message.text}</li>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="ml-[10px] mt-[10px] border-white border rounded-xl 
                  w-1/2 p-[5px] bg-white ">
                  <div className="font-bold">{message.name}:</div>
                  <li>{message.text}</li>
                </div>
              )
            )}
          {messages.length === 0 && (
            <div className="ml-[100px] mt-[20px]">Пока нет сообщений...</div>
          )}
        </ul>

        <div className="pl-[5px] h-full border-l-2 border-white  overflow-auto">
          <p>Пользователи онлайн:</p>
          {usersData.map((userData) => (
            <li className="flex justify-center" key={userData.socketID}>
              <Link
                to={`/private-chat/`}
                className="cursor-pointer hover:font-bold">
                {userData.user} ({userData.email})
              </Link>
            </li>
          ))}
        </div>
      </div>

      <form onSubmit={sendMessage} className="mt-auto flex flex-col">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          className="w-full ml-[10px] pl-[20px]"
          placeholder="Введите сообщение"
        />
        <button
          type="submit"
          className="mt-[10px] hover:font-bold cursor-pointer outline-none"
        >
          Отправить сообщение
        </button>
      </form>
    </div>
  );
};

export default Chat;
