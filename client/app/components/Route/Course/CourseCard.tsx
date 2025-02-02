import Ratings from "@/app/utils/Ratings";
import { Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `/course-access/${item._id}`}
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur dark:border-[#ffffff45] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner hover:scale-105 transition: all 0.2s ease-in-out bg-[#fff]">
        <Image
          src={item.thumbnail.url}
          width={500}
          height={300}
          objectFit="cover"
          className="rounded-lg h-[200px]"
          alt=""
        />
        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff]">
          {item.name}
        </h1>
        <br />
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={item.ratings} />
          <h5
            className={`text-black dark:text-white ${
              isProfile && "hidden 800px:inline"
            }`}
          >
            {item.purchased} Students
          </h5>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
