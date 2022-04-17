import React from "react";
import "./Button.css";

interface Props {
  children: string,
  disabled?: boolean,
  onClick: () => void
  type?: 'button' | 'reset' | 'submit'
}

const Button = ({ children, disabled = false, onClick, type = 'button' }: Props) => {
  return (
    <button className="Button" disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
