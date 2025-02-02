"use client";
import React from "react";
import Heading from "../../utils/heading";
import AdminSideBar from "../../components/admin/sidebar/AdminSideBar";
import AdminProtected from "../../hooks/adminProtected";
import AllInvoices from "../../components/admin/Order/AllInvoices";
import DashboardHero from "@/app/components/admin/DashboardHero";

type Props = {};

const page = (props: Props) => {
  return (
    
      <div>
        <AdminProtected>
        <Heading
          title="Enrollment - admin"
          description=""
          keywords="Online enrollement system"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSideBar />
          </div>
          <div className="w-[85%]">
          <DashboardHero/>
            <AllInvoices/>
          </div>
        </div>
        </AdminProtected>
      </div>
    
  );
};

export default page;
