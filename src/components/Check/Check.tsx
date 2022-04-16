import React from "react";
import cx from "classnames";
import { CheckType, ValueType } from "../../api";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import "./Check.css";

interface Props extends CheckType {
  active?: boolean,
  disabled?: boolean,
  onValueSelect: (value: ValueType) => void
}

const Check = ({ active = false, disabled = false, description, onValueSelect, value }: Props) => {
  return (
    <li className={cx("Check", { "Check--active": active, "Check--disabled": disabled })}>
      <p className="Check__description">{description}</p>
      <ButtonGroup disabled={disabled} onClick={onValueSelect} value={value} />
    </li>
  );
};

export default Check;
