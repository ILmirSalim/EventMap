import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store/store'
import UserCredentials from './interface/userCredentails'

interface User {
  email: string;
  password: string;
  userName: string;
  userAge: string;
  interestsAndPreferences: string[];
}

const AuthComponent: React.FC = () => {
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    userName: '',
    userAge: '',
    interestsAndPreferences: '',
    email: '',
    password: '',
    avatarPath: ''
  })

  const dispatch = useDispatch<AppDispatch>()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const recoverPassword = async (email: string) => {
    try {
      const response = await axios.post("http://localhost:3002/api/recoverPassword", { email });
      console.log("Recovered password:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login(userCredentials));
  };
  const toggleHidden = () => {
    setIsHidden(false)
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    const user = localStorage.getItem('token')
    if (user) {
      // setIsAuthenticated(true)
    }
  }, [])
  return (
    <>
      {isAuthenticated ? null : (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userCredentials.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={userCredentials.password}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
          {isHidden && <button onClick={toggleHidden}>Не помню пароль...</button>}
          {!isHidden &&
            // <form onSubmit={recoverPassword}>
            <div>
               <label>Введите email вашей учетной записи:</label>
              <input className='w-48 outline-none'
                placeholder='Введите email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button onClick={()=>recoverPassword(email)} className='bg-green-500 text-white rounded-2xl p-[3px]'>Восстановить пароль</button>
            </div>
             
            // </form>
            }
            
        </>
      )}
    </>
  );
};

export default AuthComponent;