import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState, AppDispatch } from "../../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../../assets/avatar.svg";
import { getUser } from "../../redux/slices/userSlice";
import { apiServer } from "../../constants";
import { ENDPOINT } from "../../constants";
import { Input } from "../../ui-components/Input";

export const AvatarUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [path, setPath] = useState<string | undefined>("");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleSubmit = async (userId: string) => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        formData.append("_id", userId);

        await axios.post(`${apiServer}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch(getUser(user!.email));
        alert("Аватар успешно добавлен!");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Добавьте картинку для добавления!");
    }
  };

  useEffect(() => {
    setPath(user?.avatar?.split("\\").pop());
  }, [user, path]);

  return (
    <div className="flex flex-col justify-center items-center ">
      {!user?.avatar && (
        <img className="h-[100px] w-[100px]" src={avatar} alt="Avatar" />
      )}
      {user?.avatar && (
        <img
          className="h-[100px] w-[100px]"
          src={`${ENDPOINT}/${path}`}
          alt="Uploaded Avatar"
        />
      )}
      {!user?.avatar && (
        <label
          className="h-[40px] bg-gradient-to-r from-green-400 to-cyan-400 w-[200px] 
          rounded-xl cursor-pointer mt-[10px] pt-[6px]"
        >
          <span className="hover:text-white ml-[30px]">Добавить картинку</span>
          <Input
            className="opacity-0"
            type="file"
            onChange={handleFileChange}
          />
        </label>
      )}
      {!user?.avatar && (
        <button
          className="bg-gradient-to-r from-green-400 to-cyan-400 hover:text-white
       mt-[10px] rounded-xl p-[8px]"
          onClick={() => handleSubmit(user!._id!)}
        >
          Загрузить аватар
        </button>
      )}
      {user?.avatar && (
        <div className="flex flex-col justify-center items-center ">
          <button
            className="bg-gradient-to-r from-green-400 to-cyan-400 hover:text-white
            mt-[10px] p-[4px] rounded-xl "
            onClick={() => handleSubmit(user._id!)}
          >
            Изменить аватар пользователя
          </button>
          <label
            className="h-[40px] bg-gradient-to-r from-green-400 to-cyan-400 w-[200px] 
          rounded-xl cursor-pointer mt-[10px] pt-[6px]"
          >
            <span className="hover:text-white ml-[30px]">
              Добавить картинку
            </span>
            <Input
              className="opacity-0"
              type="file"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
