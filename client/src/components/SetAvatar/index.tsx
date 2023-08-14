import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RootState, } from '../../redux/store/store'
import {  useSelector } from 'react-redux';
import avatar from '../../assets/avatar.svg'

export const AvatarUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [path, setPath] = useState<string  | undefined>('')
  const user = useSelector((state: RootState) => state.auth.user)
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
        
        const response = await axios.post(
          'http://localhost:3002/api/upload',
          formData ,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            
          }
        );
        const avatarPath = response.data.avatarPath
        
        // Обработка успешного ответа
        console.log(typeof(avatarPath));
      } catch (error) {
        console.error(error);
        // Обработка ошибки
      }
    } else {
      alert('Добавьте картинку для добавления!');
    }
  };
  
  useEffect(()=> {
    setPath(user?.avatar?.split('\\').pop())
   
  }, [user, path])
 
  return (
    <div className='flex flex-col justify-center items-center '>
      {!user?.avatar && <img className='h-[100px] w-[100px]' src={avatar} alt="Avatar" />}
      <button className='bg-gradient-to-r from-green-400 to-cyan-400 hover:text-white
       mt-[10px] p-[4px] rounded-xl ' onClick={()=>handleSubmit(user?._id)}>Загрузить аватар</button>
      <input className='mt-[10px]' type="file" onChange={handleFileChange} />
      {user?.avatar && <img className='h-[50px] w-[50px]' src={`http://localhost:3002/${path}`} alt="Uploaded Avatar" />}
    </div>
  );
};

export default AvatarUpload;