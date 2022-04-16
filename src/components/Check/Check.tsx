import React from "react";
import cx from "classnames";
import { CheckType } from "../../api";
import "./Check.css";

interface Props extends CheckType {
  active?: boolean
}

const Check = ({ active = false, description }: Props) => {
  return (
    <li className={cx("Check", { "Check--active": active })}>
      <p className="Check__description">{description}</p>
    </li>
  );
};

export default Check;
