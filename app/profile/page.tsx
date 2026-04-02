import React from "react";
import Profile from "../components/profile/Profile";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const page = () => {
  return (
    <>
      <section className="profilesettings">
        <Header />
        <Profile />
        <Footer />
      </section>
    </>
  );
};

export default page;
