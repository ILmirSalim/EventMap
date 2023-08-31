import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className='w-full mt-[30px]'>
      <div className="border border-white w-100"></div>
      <div className="mt-[10px]">
        <div className="flex justify-center">
          <h3 className='p-[3px] font-bold'>Наши контакты:</h3>
          <p className='p-[3px]'>Email: example@mail.com</p>
          <p className='p-[3px]'>Телефон: 123-456-7890</p>
        </div>
        <div className="flex p-[10px] justify-evenly">
          <h3 className='font-bold'>Мы в социальных сетях:</h3>
          <a className='' href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
          <a className='' href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a className='' href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
        </div>
      </div>

      <div className="flex justify-center">
        <a href="/privacy-policy" className='font-bold'>Политика конфиденциальности</a>
      </div>
    </footer>
  );
}

export default Footer;