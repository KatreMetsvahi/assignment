import React from "react";
import { CheckType } from "../../api";
import "./Check.css";

interface Props extends CheckType {}

const Check = ({ description }: Props) => {
  return (
    <li className="Check">
      <p className="Check__description">{description}</p>
    </li>
  );
};

export default Check;
