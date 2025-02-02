'use client'
import React, { useState } from 'react'
import Heading from '../utils/heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Policy from "./Policy"

type Props = {}

const Page = (props: Props) => {
     const [open, setOpen] = useState(false);
      const [activeItem, setActiveItem] = useState(3);
      const [route, setRoute] = useState("Login");

  return (
    <div>
        <Heading
            title="Policy - Richwell colleges"
            description=''
            keywords=''
        />
        <Header
            open={open}
            setOpen={setOpen}
            activeItem={activeItem}
            setRoute={setRoute}
            route={route}
        />
        <Policy/>
        <Footer/>
    </div>
  )
}

export default Page