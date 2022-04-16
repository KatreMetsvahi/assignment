import React from "react";
import cx from "classnames";
import { ValueType } from "../../api";
import "./ButtonGroup.css";

interface ButtonProps {
  active: boolean,
  children: string,
  onClick: () => void
}

const Button = ({ active, children, onClick }: ButtonProps) => {
  return (
    <button
      className={cx("ButtonGroup__button", { "ButtonGroup__button--active": active })}
      onClick={onClick}
    >
      {children}
    </button>
  )
};

interface ButtonGroupProps {
  onClick: (value: ValueType) => void,
  value?: ValueType
}

const ButtonGroup = ({ onClick, value }: ButtonGroupProps) => {
  return (
    <div className="ButtonGroup">
      <Button active={value === 'yes'} onClick={() => onClick('yes')}>Yes</Button>
      <Button active={value === 'no'} onClick={() => onClick('no')}>No</Button>
    </div>
  );
};

export default ButtonGroup;
