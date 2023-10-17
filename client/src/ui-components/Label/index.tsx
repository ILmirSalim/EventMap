import React from "react";

interface InputLabelProps {
    text: string;
    className?: string
  }

export const Label = (props: InputLabelProps) => <label {...props}>{props.text}</label>;