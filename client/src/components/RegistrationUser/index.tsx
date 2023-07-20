import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, hasUser, logout } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store/store'
import Chat from './components/chat';
import SetAvatar from '../SetAvatar/index'
import avatar from '../../images/avatar.svg'

const RegistrationUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [interestsAndPreferences, setinterestsAndPreferences] = useState('');
  const [avatarPath, setAvatar] = useState('');

  const dispatch = useDispatch<AppDispatch>()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user)

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

      // const formData:any = new FormData();
      // formData.append('email', email);
      // formData.append('password', password);
      // formData.append('userName', userName);
      // formData.append('userAge', userAge);
      // formData.append('interestsAndPreferences', interestsAndPreferences);
      // if (avatar) {
      //   formData.append('avatar', avatar);
      // }
    } catch (error) {
      console.log('Registration error:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout())
  };

  useEffect(() => {
    const user = localStorage.getItem('token')

    if (user) {
      dispatch(hasUser())
    }
  }, [dispatch])
  return (
    <>
      {isAuthenticated ? (
        <div className='bg-gradient-to-r from-teal-200 to-lime-200  
        w-96 h-96  shadow-lg shadow-white flex flex-col items-center 
        justify-center'>
          {/* {!user?.avatar && <img src={avatar} alt="Avatar" />} */}
          <SetAvatar />
          <p>Имя пользователя: {user?.userName}</p>
          <div>Возраст: {user?.userAge} </div>
          <div>Интересы: {user?.interestsAndPreferences}</div>
          <div>
            <button
              className='cursor-pointer hover:text-white hover:font-bold 
              bg-gradient-to-r from-green-400 to-cyan-400 mt-[20px] rounded-xl p-[5px]'
              onClick={handleLogout}>Выйти из профиля</button>
            <button className='cursor-pointer hover:text-white bg-gradient-to-r from-green-400 to-cyan-400
             hover:font-bold ml-[10px] mt-[20px] p-[5px] rounded-xl' >
              Удалить профиль</button>
          </div>
        </div>

      ) : (
        <>
          <div>Зарегистрироваться</div>
          <form onSubmit={handleRegister} encType='multipart/form-data'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <input
              type="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter name"
            />
            <input
              type="userAge"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              placeholder="Enter userAge"
            />
            <input
              type="interestsAndPreferences"
              value={interestsAndPreferences}
              onChange={(e) => setinterestsAndPreferences(e.target.value)}
              placeholder="Enter interestsAndPreferences"
            />
            {/* <input
              type="file"
              accept=".png,.jpg,.jpeg" // Добавьте ограничение на тип файла, который может быть загружен
              onChange={(e) => {
                if (e.target.files) {
                  setAvatar(e.target.files[0]); // Сохраняем выбранный файл в состоянии
                }
              }}
            /> */}
            <button className='cursor-pointer' type="submit">Register</button>
          </form>
        </>
      )}
    </>
  );
};

export default RegistrationUser;