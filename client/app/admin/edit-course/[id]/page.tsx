'use client'
import React from 'react'
import AdminSidebar from "../../../components/admin/sidebar/AdminSideBar";  // Corrected the import
import Heading from "../../../../app/utils/heading";
import EditCourse from "../../../components/admin/Course/EditCourse"
import DashboardHero from '@/app/components/admin/DashboardHero';

type Props = {}

const Page = ({ params }: any) => {
    const id = params?.id;

  return (
    <div>
        <Heading
            title="Enrollment - System"
            description="Enrollment system is a platform for new student enrolled online platform"
            keywords="Riwchwell"
        />
        <div className="flex">
            <div className='1500px:w-[16%] w-1/5'>
                <AdminSidebar/> 
            </div>
            <div className='w-[85%]'>
            <DashboardHero/>
                <EditCourse id={id}/>
            </div>
        </div>
    </div>
  )
}

export default Page;  // Corrected the page component name to be PascalCase
