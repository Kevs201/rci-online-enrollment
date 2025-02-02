"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ"
import Footer from "./components/Footer"

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Enrollment System"
        description="Lorem Ipsum is simply dummy text of the printing and typesetting"
        keywords="All about love"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses />
      <br />
      <br />
      <br />
      <Reviews />
      <br />
      <br />
      <br />
      <FAQ/>
      <br /><br />
      <Footer/>
    </div>
  );
};

export default Page;
