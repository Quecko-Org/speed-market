"use client";

import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

interface ShowToastOptions {
  asset?: string;
  amount?: string;
  duration?: string;
  message?: string;
}

export const showToast = (
  type:
    | "positionOpenedup"
    | "positionOpeneddown"
    | "roundWon"
    | "roundLost"
    | "profileupdated"
    | "error"
    | "success"
    | "info" = "info",
  options?: ShowToastOptions,
) => {
  toast(
    <CustomToast
      type={type}
      asset={options?.asset}
      amount={options?.amount}
      duration={options?.duration}
      message={options?.message}
    />,
    {
      closeButton: type !== "profileupdated",
    },
  );
};
