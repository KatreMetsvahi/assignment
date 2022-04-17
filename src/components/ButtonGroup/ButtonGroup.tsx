import React from "react";
import cx from "classnames";
import { ValueType } from "../../api";
import "./ButtonGroup.css";

interface ButtonProps {
  active: boolean,
  children: string,
  disabled?: boolean,
  onClick: () => void
}

const Button = ({ active, children, disabled = false, onClick }: ButtonProps) => {
  return (
    <button
      className={cx("ButtonGroup__button", {
        "ButtonGroup__button--active": active,
        "ButtonGroup__button--disabled": disabled
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
};

interface ButtonGroupProps {
  disabled?: boolean,
  onClick: (value: ValueType) => void,
  value?: ValueType
}

const ButtonGroup = ({ disabled = false, onClick, value }: ButtonGroupProps) => {
  return (
    <div className="ButtonGroup">
      <Button active={value === 'yes'} disabled={disabled} onClick={() => onClick('yes')}>Yes</Button>
      <Button active={value === 'no'} disabled={disabled} onClick={() => onClick('no')}>No</Button>
    </div>
  );
};

export default ButtonGroup;
