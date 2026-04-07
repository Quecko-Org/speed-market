"use client";

import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

export const showToast = (
  type:
    | "positionOpenedup"
    | "positionOpeneddown"
    | "roundWon"
    | "roundLost"
    | "profileupdated" = "profileupdated"
) => {
  toast(<CustomToast type={type} />, {
    closeButton: type !== "profileupdated", // ❌ hide only for profileupdated
  });
};