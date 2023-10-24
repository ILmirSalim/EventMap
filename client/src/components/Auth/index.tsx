import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import { RootState, AppDispatch } from "../../redux/store/store";
import UserCredentials from "./interface/userCredentails";
import { useNavigate } from "react-router-dom";
import { buttonAuth, buttonRecover } from "./style";
import { apiServer } from "../../constants";
const AuthComponent: React.FC = () => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    userName: "",
    userAge: "",
    interestsAndPreferences: "",
    email: "",
    password: "",
    avatarPath: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const recoverPassword = async (email: string) => {
    try {
      const response = await axios.post(
        `${apiServer}/recoverPassword`,
        { email }
      );
      console.log("Recovered password:", response.data);
    } catch (error) {
      console.error(error, "Что то пошло не так при восстановлении!");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login(userCredentials));
    navigate("/");
  };
  const toggleHidden = () => {
    setIsHidden(false);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    setDisabled(!(userCredentials.email && userCredentials.password));
  }, [userCredentials.password, userCredentials.email]);

  return (
    <>
      {isAuthenticated ? null : (
        <div
          className="flex flex-col justify-center items-center 
        h-screen w-[400px] mt-[-100px] shadow-2xl shadow-white"
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-[10px]">
              Email:
              <input
                className="ml-[22px] p-[5px] rounded-xl outline-none"
                type="email"
                name="email"
                value={userCredentials.email}
                onChange={handleInputChange}
                placeholder="Введите email"
              />
            </label>
            <label className="mb-[10px]">
              Пароль:
              <input
                className="ml-[5px] p-[5px] rounded-xl outline-none "
                type="password"
                name="password"
                value={userCredentials.password}
                onChange={handleInputChange}
                placeholder="Введите пароль"
              />
            </label>
            <button disabled={disabled} type="submit" className={buttonAuth}>
              Авторизация
            </button>
          </form>
          {isHidden && (
            <button className="mt-[5px]" onClick={toggleHidden}>
              Не помню пароль...
            </button>
          )}
          {!isHidden && (
            <div className="mt-[10px] flex flex-col items-center justify-center mt-[20px]">
              <label className="font-bold mr-[5px]">
                Введите email вашей учетной записи:
              </label>
              <input
                className="w-48 outline-none mt-[10px] mb-[10px] p-[5px] rounded-xl outline-none"
                placeholder="Введите email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                onClick={() => recoverPassword(email)}
                className={buttonRecover}
              >
                Восстановить пароль
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AuthComponent;
