import React from "react";
import cx from "classnames";
import { CheckType, ValueType } from "../../api";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import "./Check.css";

interface Props extends CheckType {
  active?: boolean,
  onValueSelect: (value: ValueType) => void
}

const Check = ({ active = false, description, onValueSelect, value }: Props) => {
  return (
    <li className={cx("Check", { "Check--active": active })}>
      <p className="Check__description">{description}</p>
      <ButtonGroup onClick={onValueSelect} value={value} />
    </li>
  );
};

export default Check;
