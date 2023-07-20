import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store'
import Chat from "../RegistrationUser/components/chat";
import chatImage from '../../images/image.svg'
// import './style.css'

export const Root = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  const [isChatOpen, setIsChatOpen] = React.useState<boolean>(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }
  return (<div className="pl-[50px] bg-gradient-to-r from-teal-200 to-lime-200 pr-[50px] ">
    <div className="flex flex-row items-center shadow-2xl shadow-white  ">
      <svg className="" width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8.25C11.5858 8.25 11.25 8.58579 11.25 9C11.25 9.41421 11.5858 9.75 12 9.75C12.4142 9.75 12.75 9.41421 12.75 9C12.75 8.58579 12.4142 8.25 12 8.25Z" fill="#3A52EE" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C8.60218 3 6 5.58614 6 8.8125C6 10.6204 6.84017 12.5038 7.91017 14.0845C8.98664 15.6747 10.3653 17.0616 11.584 17.874C11.8359 18.042 12.1641 18.042 12.416 17.874C13.6347 17.0616 15.0134 15.6747 16.0898 14.0845C17.1598 12.5038 18 10.6204 18 8.8125C18 5.58614 15.3978 3 12 3ZM9.75 9C9.75 7.75736 10.7574 6.75 12 6.75C13.2426 6.75 14.25 7.75736 14.25 9C14.25 10.2426 13.2426 11.25 12 11.25C10.7574 11.25 9.75 10.2426 9.75 9Z" fill="white" />
        <path d="M6.93012 16.6C7.33221 16.5005 7.57753 16.0939 7.47805 15.6918C7.37857 15.2897 6.97197 15.0444 6.56988 15.1439C5.61574 15.38 4.78135 15.6883 4.16678 16.0706C3.5895 16.4296 3 16.9885 3 17.7785C3 18.4839 3.47385 19.0048 3.96484 19.3526C4.47548 19.7142 5.16572 20.0093 5.95114 20.2446C7.53154 20.718 9.66994 21 12 21C14.3301 21 16.4685 20.718 18.0489 20.2446C18.8343 20.0093 19.5245 19.7142 20.0352 19.3526C20.5261 19.0048 21 18.4839 21 17.7785C21 16.9885 20.4105 16.4296 19.8332 16.0706C19.2186 15.6883 18.3843 15.38 17.4301 15.1439C17.028 15.0444 16.6214 15.2897 16.5219 15.6918C16.4225 16.0939 16.6678 16.5005 17.0699 16.6C17.948 16.8172 18.6136 17.0784 19.041 17.3443C19.2537 17.4766 19.3787 17.5925 19.4447 17.6782C19.4762 17.7191 19.4899 17.7474 19.4955 17.7621C19.4983 17.7694 19.4993 17.7739 19.4997 17.7758C19.5 17.7776 19.5 17.7785 19.5 17.7785L19.4998 17.7806C19.4998 17.7806 19.4989 17.7852 19.4971 17.7904C19.4935 17.8009 19.4846 17.8221 19.4631 17.8536C19.4178 17.9198 19.3286 18.0149 19.1682 18.1285C18.8439 18.3582 18.3259 18.5957 17.6184 18.8077C16.2129 19.2287 14.2263 19.5 12 19.5C9.77371 19.5 7.78711 19.2287 6.3816 18.8077C5.67406 18.5957 5.15612 18.3582 4.83182 18.1285C4.67144 18.0149 4.58216 17.9198 4.53692 17.8536C4.5154 17.8221 4.50646 17.8009 4.50289 17.7904C4.50111 17.7852 4.50022 17.7806 4.50022 17.7806L4.5 17.7785C4.5 17.7785 4.5 17.7776 4.50034 17.7758C4.50071 17.7739 4.50173 17.7694 4.5045 17.7621C4.51013 17.7474 4.52377 17.7191 4.55527 17.6782C4.62132 17.5925 4.74628 17.4766 4.95903 17.3443C5.3864 17.0784 6.05201 16.8172 6.93012 16.6Z" fill="white" />
      </svg>
      <NavLink className="pl-[50px] w-1/5" to="/">Главная страница</NavLink>
      {user && (
        <>
          <NavLink className="pl-[50px] w-1/5" to="/search-event">Поиск мероприятий</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/create-event">Создать мероприятие</NavLink>
          <NavLink className="pl-[50px] w-1/5" to="/detail-event">Мои мероприятия</NavLink>
        </>
      )}
      <NavLink className="pl-[50px] w-1/5" to="/user-profile">Профиль</NavLink>
    </div>
    <div className="flex justify-around items-center mt-[50px] h-full w-full p-[20px]">

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

    </div>
  </div>)
}