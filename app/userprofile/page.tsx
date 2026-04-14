import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Userprofile from "../components/Userprofile/Userprofile";

const page = () => {
  return (
    <>
      <section className="profilesettings">
        <Header />
        <Userprofile />
        <Footer />
      </section>
    </>
  );
};

export default page;
