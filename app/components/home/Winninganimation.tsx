"use client";
import React, { FC, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getCoinActivity } from "@/app/services/coinListing";

interface WinItem {
  _id: string;
  userId?: { displayName?: string; internalWalletAddress?: string; profileImage?: string } | string;
  cryptoSymbol?: string;
  amount?: string;
}

function getUserLabel(userId: WinItem["userId"]): string {
  if (!userId) return "Unknown";
  if (typeof userId === "string") return userId;
  if (userId.displayName) return userId.displayName;
  if (userId.internalWalletAddress) {
    const addr = userId.internalWalletAddress;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
  return "Unknown";
}

const Winninganimation: FC = () => {
  const [wins, setWins] = useState<WinItem[]>([]);

  useEffect(() => {
    const fetchWins = async () => {
      try {
        const response = await getCoinActivity(undefined, 1, 20, "WIN");
        if (response) {
          setWins(response.bets ?? response.data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch winning activity:", err);
      }
    };

    fetchWins();
  }, []);

  if (wins.length === 0) return null;

  return (
    <div className="mainanimation">
      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={true}
      >
        {wins.map((item) => (
          <div className="inneranimation" key={item._id}>
            <div className="userimg">
              <img
                src={(typeof item.userId === "object" && item.userId?.profileImage) || "/dummyassets/dummyuser.png"}
                alt="user"
                className="innerimg"
              />
            </div>

            <div className="animationtexts">
              <p className="whitepara">{getUserLabel(item.userId)}</p>
              <p className="greypara">just won</p>
              <p className="whitepara">${(Number(item.amount ?? 0) * 1.92).toFixed(2)}</p>
              <p className="greypara">on {item.cryptoSymbol ?? "—"}/USDT</p>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Winninganimation;
