import React, { FC } from "react";
import Market from "./Market";
import Footer from "../footer/Footer";

const Home: FC = () => {
  return (
    <>
      <section className="mainhome">
        <Market />
        <Footer />
      </section>
    </>
  );
};

export default Home;
