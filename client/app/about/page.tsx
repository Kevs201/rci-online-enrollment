'use client';

import React, { useState } from 'react';
import Heading from '../utils/heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from './About';

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState('Login');

  return (
    <div>
      <Heading
        title="About-us - Mission Vision"
        description=""
        keywords=""
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <About />
      <Footer />
    </div>
  );
};

export default Page;
