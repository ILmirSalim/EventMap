import React from "react";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    forwardRef?: React.Ref<HTMLInputElement>;
}

export const Input = (props: InputProps) => <input {...props} />;

export const InputWithRef = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
    <input ref={ref} {...props} />
));