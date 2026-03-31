import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <section className="mainfooter">
      <div className="custom-container">
        <div className="innerfooter">
          <a href="/" className="mainlogo">
            <img src="/logo.svg" alt="logoimg" className="logoimg" />
          </a>
          <p className="footerpara">
            ©2026 SPEED MARKETS. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
