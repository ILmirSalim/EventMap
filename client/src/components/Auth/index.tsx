import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, register } from '../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

interface User {
  email: string;
  password: string;
  userName: string;
  userAge: string;
  interestsAndPreferences: string[];
}

interface AuthResponse {
  token: string;
  user: User;
  refreshToken: string
}

const AuthComponent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [interestsAndPreferences, setinterestsAndPreferences] = useState('');
  const dispatch = useDispatch();
  const isAuthenticatedd = useSelector((state: any) => state.auth.isAuthenticated);
  const error = useSelector((state: any) => state.auth.error);

  const handleRegister = async () => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3002/api/registration', {
        email,
        password,
        userName,
        userAge,
        interestsAndPreferences
      });
      localStorage.setItem('token', response.data.refreshToken);
      console.log(response.data);

      setIsAuthenticated(true);
      alert("Регистрация прошла успешно")
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    const payload = {
      email:email,
      password: password
    }
    try {
      dispatch(login(payload));
    } catch (error) {
      console.log(error);
    }
  };
  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post<AuthResponse>('http://localhost:3002/api/login', {
  //       email,
  //       password,
  //     });
  //     localStorage.setItem('token', response.data.refreshToken);
  //     setIsAuthenticated(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    console.log(localStorage.getItem('token'));

    const user = localStorage.getItem('token')
    if (user) {
      setIsAuthenticated(true)
    }
  }, [])
  return (
    <>
      {isAuthenticated ? (
        <>
          <div>Welcome back</div>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <div>Register:</div>
          <input
            type="text"
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
          <button onClick={handleRegister}>Register</button>
          <button className='ml-[50px]' onClick={handleLogin}>login</button>

        </>
      )}
    </>
  );
};

export default AuthComponent;