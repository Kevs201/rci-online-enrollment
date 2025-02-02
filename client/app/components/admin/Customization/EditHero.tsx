"use client";
import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner.title);
      setSubTitle(data?.layout?.banner.subTitle);
      setImage(data?.layout?.banner?.image?.url);
    }
    if (isSuccess) {
      toast.success("Hero updated successfully!");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    try {
      await editLayout({
        type: "Banner",
        image,
        title,
        subTitle,
      });
    } catch (err) {
      toast.error("Failed to update the hero section");
    }
  };

  const hasChanges =
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subTitle !== subTitle ||
    data?.layout?.banner?.image?.url !== image;

  return (
    <div className="w-full 1000px:flex items-center">
      <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[500px] 1100px:w-[500px] h-[50vh] w-[50vh] hero_animation rounded-[50%] 1100px:left-[18rem] 1500px:left-[21rem]"></div>
      <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
        <div className="relative flex items-center justify-end">
          <img
            src={image}
            alt=""
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[90%] h-auto z-[10] rounded-full"
          />
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />
          <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
            <AiOutlineCamera className="dark:text-white text-black text-[18px] cursor-pointer" />
          </label>
        </div>
      </div>
      <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
        <textarea
          className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] font-[600] bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={4}
        />
        <br />
        <textarea
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          placeholder="We need 40k+ Online courses & 500k Online register. Find your desired courses from them"
          className="dark:text-white text-purple-600 font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[74px] bg-transparent"
        ></textarea>
        <br />
        <br />
        <br />
        <div
          className={`${
            styles.button
          } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-purple-600 bg-[#cccccc34] ${
            hasChanges
              ? "!cursor-pointer !bg-purple-500"
              : "!cursor-not-allowed"
          } !rounded absolute bottom-12 right-12`}
          onClick={hasChanges ? handleEdit : () => null}
        >
          Save
        </div>
      </div>
    </div>
  );
};

export default EditHero;
