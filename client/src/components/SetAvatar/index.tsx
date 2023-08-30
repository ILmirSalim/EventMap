import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RootState, AppDispatch } from '../../redux/store/store'
import { useSelector, useDispatch } from 'react-redux';
import avatar from '../../assets/avatar.svg'
import { getUser, login } from '../../redux/slices/userSlice';
interface ResponsePayload {
  avatar?: string;
  // Другие свойства, присутствующие в response.payload
}
export const AvatarUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [path, setPath] = useState<string | undefined>('')
  const [newPath, setNewPath] = useState<string | undefined>()
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleSubmit = async (userId: any) => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('_id', userId)

        await axios.post(
          'http://localhost:3002/api/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },

          }
        );
        const response = await dispatch(getUser({ email: user?.email }));
        // setNewPath(response.data);

        console.log('newPath', newPath);

        // dispatch(getUser({email: user?.email}))
        alert('Аватар успешно добавлен!')

      } catch (error) {
        console.error(error);
        // Обработка ошибки
      }
    } else {
      alert('Добавьте картинку для добавления!');
    }
  };

  useEffect(() => {
    setPath(user?.avatar?.split('\\').pop())


  }, [user, path])

  return (
    <div className='flex flex-col justify-center items-center '>
      {!user?.avatar && <img className='h-[100px] w-[100px]' src={avatar} alt="Avatar" />}
      {user?.avatar && <img className='h-[100px] w-[100px]' src={`http://localhost:3002/${path}`} alt="Uploaded Avatar" />}
      {!user?.avatar && <input className='mt-[10px]' type="file" onChange={handleFileChange} />}
      {!user?.avatar && <button className='bg-gradient-to-r from-green-400 to-cyan-400 hover:text-white
       mt-[10px] p-[4px] rounded-xl ' onClick={() => handleSubmit(user?._id)}>Загрузить аватар</button>}
      {user?.avatar && (
        <div className='flex flex-col justify-center items-center '>
          <button className='bg-gradient-to-r from-green-400 to-cyan-400 hover:text-white
            mt-[10px] p-[4px] rounded-xl ' onClick={() => handleSubmit(user?._id)}>
            Изменить аватар пользователя
          </button>
          <input className='mt-[10px]' type="file" onChange={handleFileChange} />
        </div>
      )}


    </div>
  );
};

export default AvatarUpload;