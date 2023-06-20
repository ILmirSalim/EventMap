import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store/store'


interface User {
  email: string;
  password: string;
  userName: string;
  userAge: string;
  interestsAndPreferences: string[];
}

interface AuthResponse {
  accesstoken: string;
  user: User;
  refreshToken: string
}

interface UserCredentials {
  email: string;
  password: string;
  userName: string;
  userAge: string;
  interestsAndPreferences: string;
}


const AuthComponent: React.FC = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [userName, setUserName] = useState('');
  // const [userAge, setUserAge] = useState('');
  // const [interestsAndPreferences, setinterestsAndPreferences] = useState('');

  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    userName: '',
    userAge: '',
    interestsAndPreferences: '',
    email: '',
    password: '',
  })

  const dispatch = useDispatch<AppDispatch>()


  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login(userCredentials));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    console.log(localStorage.getItem('token'));

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

        </>
      )}
    </>
  );
};

export default AuthComponent;