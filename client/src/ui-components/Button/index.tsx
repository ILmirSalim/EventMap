import React, { ButtonHTMLAttributes } from "react";
import './style.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = (props) => (
  <button {...props}></button>
);