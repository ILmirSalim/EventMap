import React from 'react';
import AuthComponent from '../../components/Auth';
import axios from 'axios';

export const UserProfile: React.FC = () => {
  
  return (
    <div>
      <h1>Страница профиля</h1>
      <p>Имя пользователя</p>
      <p>Возраст пользователя</p>
      <p>Интересы пользователя</p>
      <p>Предпочтения пользователя</p>
      <AuthComponent/>
    </div>
  );
};
export default UserProfile;
