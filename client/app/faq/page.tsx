'use client'
import React, { useState } from 'react'
import Heading from '../utils/heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ/FAQ';

type Props = {}

const Page = (props: Props) => {
     const [open, setOpen] = useState(false);
      const [activeItem, setActiveItem] = useState(4);
      const [route, setRoute] = useState("Login");

  return (
    <div className='min-h-screen'>
        <Heading
            title="FAQ - Richwell colleges"
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
        <FAQ/>
        <Footer/>
    </div>
  )
}

export default Page