"use client";

import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

interface ShowToastOptions {
  asset?: string;
  amount?: string;
  duration?: string;
}

export const showToast = (
  type:
    | "positionOpenedup"
    | "positionOpeneddown"
    | "roundWon"
    | "roundLost"
    | "profileupdated" = "profileupdated",
  options?: ShowToastOptions
) => {
  toast(<CustomToast type={type} asset={options?.asset} amount={options?.amount} duration={options?.duration} />, {
    closeButton: type !== "profileupdated",
  });
};