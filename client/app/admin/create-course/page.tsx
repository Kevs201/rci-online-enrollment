"use client"
import React from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSideBar"; 
import Heading from "../../../app/utils/heading";
import CreateCourse from "../../components/admin/Course/CreateCourse";
import DashboardHero from "../../components/admin/DashboardHero";

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Enrollment - System"
        description="Enrollment system is a platform for new student enrolled online platform"
        keywords="Riwchwell"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default Page;
