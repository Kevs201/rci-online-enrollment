'use client'

import React, { useEffect, useState } from 'react'
import AdminSidebar from "../../../components/admin/sidebar/AdminSideBar";
import Heading from "../../../../app/utils/heading";
import DashboardHeader from "../../../../app/components/admin/DashboardHeader";
import ViewStudent from "../../../components/admin/Student/viewStudent";
import { useGetSingleOrderQuery } from '@/redux/features/orders/ordersApi';
import DashboardHero from '@/app/components/admin/DashboardHero';

type Props = {}

const Page = ({ params }: any) => {
    const id = params?.id;
    const { data: orderData, isLoading, error } = useGetSingleOrderQuery(id);
    const [studentName, setStudentName] = useState<string>('');

    useEffect(() => {
        if (orderData?.order) {
            setStudentName(`${orderData.order.fName} ${orderData.order.lName}`);
        }
    }, [orderData]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading student data</div>;

    return (
        <div>
            <Heading
                title={studentName || "Loading..."} // Dynamically set title
                description="Enrollment system is a platform for new student enrolled online platform"
                keywords="Riwchwell"
            />
            <div className="flex">
                <div className='1500px:w-[16%] w-1/5'>
                    <AdminSidebar/> 
                </div>
                <div className='w-[85%]'>
                    <DashboardHero/>
                    <ViewStudent id={id}/>
                </div>
            </div>
        </div>
    )
}

export default Page;
