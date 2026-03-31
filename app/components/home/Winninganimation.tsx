import React, { FC } from "react";
import Marquee from "react-fast-marquee";

const data = Array(10).fill({
  name: "BlockChainBandit",
  amount: "$234",
  pair: "SOL/USDT",
});

const Winninganimation: FC = () => {
  return (
    <div className="mainanimation">
      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={true}
      >
        {data.map((item, index) => (
          <div className="inneranimation" key={index}>
            <div className="userimg">
              <img
                src="/dummyassets/dummyuser.png"
                alt="innerimg"
                className="innerimg"
              />
            </div>

            <div className="animationtexts">
              <p className="whitepara">{item.name}</p>
              <p className="greypara">just won</p>
              <p className="whitepara">{item.amount}</p>
              <p className="greypara">on {item.pair}</p>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Winninganimation;