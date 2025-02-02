import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type Props = {};
const Hero: FC<Props> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if(search === ""){
      return
    }else{
      router.push(`/courses?title=${search}`)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full 1000px:flex items-center">
          <div className="absolute top-[100vh] md:top-[unset] lg:h-[700px] lg:w-[700px] md:h-[500px] md:w-[500px] h-[50vh] w-[50vh] hero_animation rounded-full left-[50%] transform -translate-x-1/2"></div>

          <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-[10]">
            <Image
              src={data?.layout?.banner?.image?.url}
              width={400}
              height={400}
              alt=""
              className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-[10] rounded-[10%]"
            />
          </div>
          <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
            <h2 className="dark:text-white text-purple-950 text-[30px] px-3 w-full 1000px:text-[60px] font-[700] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[60%]">
              {data?.layout?.banner.title}
            </h2>
            <br />
            <p className="dark:text-[#edfff4] text-[#000000ac] font-Poppins font-[400] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
              {data?.layout?.banner.subTitle}
            </p><br />
            <div className="1500px:w-[55%] 1100px:-[78%] w-[90%] flex items-center">
              <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
              Start your journey today with <span>Richwell Colleges </span>
                <a href="/courses" className=" bg-purple-700 text-white pl-5 pr-5 pt-3 pb-3 rounded-lg">
                  Enroll now!
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
