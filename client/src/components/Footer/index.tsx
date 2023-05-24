import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="contact-info">
          <h3>Наши контакты</h3>
          <p>Email: example@mail.com</p>
          <p>Телефон: 123-456-7890</p>
        </div>

        <div className="flex mt-10">
          <h3>Мы в социальных сетях</h3>
          <a className='pl-5' href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
          <a className='pl-5'href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a className='pl-5' href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
        </div>
      </div>

      <div className="privacy-policy">
        <a href="/privacy-policy">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}

export default Footer;