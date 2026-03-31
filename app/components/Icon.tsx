"use client";

import React, { FC } from "react";
import { ReactSVG } from "react-svg";

interface IconProps {
  name: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ name, className }) => {
  return (
    <ReactSVG
      src={`/icons/${name}.svg`}
      beforeInjection={(svg) => {
        if (className) svg.setAttribute("class", className);
      }}
    />
  );
};

export default Icon;