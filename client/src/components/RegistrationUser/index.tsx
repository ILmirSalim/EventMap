import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, hasUser, logout, deleteUser } from '../../redux/slices/userSlice';
import { RootState, AppDispatch } from '../../redux/store/store'
import SetAvatar from '../SetAvatar/index'
import { NavLink, useNavigate } from "react-router-dom";

const RegistrationUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [interestsAndPreferences, setinterestsAndPreferences] = useState('');
  const [avatarPath, setAvatar] = useState('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const dispatch = useDispatch<AppDispatch>()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await dispatch(register({
        email,
        password,
        userName,
        userAge: parseInt(userAge),
        interestsAndPreferences,
        avatarPath
      })).unwrap();
      alert("Регистрация прошла успешно");

    } catch (error) {
      console.log('Registration error:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  };

  const removeUser = async (email: any) => {
    try {
      await dispatch(deleteUser(email))
      alert('Ваша учетная запись удалена!')
      navigate('/')

    } catch (error) {
      console.error(error, "Что-то пошло не так при удалении!");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('token')
    if (email && password && userName && userAge && interestsAndPreferences) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
    if (user) {
      dispatch(hasUser())
    }
  }, [dispatch, email, password, userName, userAge, interestsAndPreferences])



  return (
    <div className='flex flex-col justify-center h-screen'>

      {isAuthenticated ? (
        <div className='bg-gradient-to-r from-teal-200 to-lime-200  
        w-96 h-96  shadow-lg shadow-white flex flex-col items-center 
        justify-center mt-[-200px]'>
          <SetAvatar />
          <p>Имя пользователя: {user?.userName}</p>
          <div>Возраст: {user?.userAge} </div>
          <div>Интересы: {user?.interestsAndPreferences}</div>
          <div>
            <button
              className='cursor-pointer hover:text-white hover:font-bold 
              bg-gradient-to-r from-green-400 to-cyan-400 mt-[20px] rounded-xl p-[5px]'
              onClick={handleLogout}>Выйти из профиля</button>
            <button onClick={() => removeUser(user?.email)} className='cursor-pointer hover:text-white bg-gradient-to-r from-green-400 to-cyan-400
              hover:font-bold ml-[10px] mt-[20px] p-[5px] rounded-xl' >
              Удалить профиль</button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col justify-center mt-[-200px]'>
          <div className='font-bold mb-[10px]'>Заполните данные для регистрации:</div>
          <form onSubmit={handleRegister} encType='multipart/form-data' className='flex flex-col'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              className=' p-[5px] rounded-xl '
            />
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className=' p-[5px] rounded-xl'
            />
            <br />
            <input
              type="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Введите имя"
              className=' p-[5px] rounded-xl'
            />
            <br />
            <input
              type="userAge"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              placeholder="Введите возраст"
              className=' p-[5px] rounded-xl'
            />
            <br />
            <input
              type="interestsAndPreferences"
              value={interestsAndPreferences}
              onChange={(e) => setinterestsAndPreferences(e.target.value)}
              placeholder="Ваши интересы"
              className='mb-[10px] p-[5px] rounded-xl'
            />
            <button disabled={disabled} className='disabled:opacity-50 disabled:hover:scale-100 
            cursor-pointer bg-gradient-to-r from-green-400 to-cyan-400 mb-[10px] p-[5px] 
            hover:scale-110 transform transition-all duration-200  rounded-xl' 
            type="submit">Зарегистрироваться</button>
          </form>
        </div>
      )}
      {!isAuthenticated && <NavLink className="p-[5px] bg-gradient-to-r from-green-400 to-cyan-400 
       hover:scale-110 transform transition-all duration-200 
       cursor-pointer text-center rounded-xl" to="/authorization">У меня есть учетная запись</NavLink>}

    </div>
  );
};

export default RegistrationUser;