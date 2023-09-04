import React from "react";
import { InputHTMLAttributes } from "react";
import './style.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = (props: InputProps) => <input {...props} />;