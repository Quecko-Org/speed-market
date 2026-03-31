"use client";

import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

export const showToast = (
  type: "positionOpenedup" | "positionOpeneddown" | "roundWon" | "roundLost" = "roundLost"
) => {
  toast(<CustomToast type={type} />);
};