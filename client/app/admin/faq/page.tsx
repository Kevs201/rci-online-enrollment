"use client";
import React from "react";
import Heading from "../../utils/heading";
import AdminSideBar from "../../components/admin/sidebar/AdminSideBar";
import AdminProtected from "../../hooks/adminProtected";
import DashboardHero from "../../components/admin/DashboardHero";
import EditFaq from "@/app/components/admin/Customization/EditFaq";
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
            <DashboardHero />
            <EditFaq/>
          </div>
        </div>
        </AdminProtected>
      </div>
    
  );
};

export default page;
