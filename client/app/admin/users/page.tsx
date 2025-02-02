"use client";
import DashboardHero from "@/app/components/admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/heading";
import React from "react";
import AdminSideBar from "../../components/admin/sidebar/AdminSideBar";
import AllUsers from "../../components/admin/Users/AllUsers";

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
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSideBar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <AllUsers isTeam={false}/>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
