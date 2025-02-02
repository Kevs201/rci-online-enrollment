import { styles } from "../../../app/styles/style";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import Image from "next/image";
import { Result } from "postcss";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/ipaSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(error);
    }
    if (success) {
      toast.success("Profile updated successfully!");
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
      });
    }
  };

  return (
    <>
      {/* Avatar Section */}
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            width={120}
            height={120}
            alt=""
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-purple-500 rounded-full"
          />
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/web"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="text-white" />
            </div>
          </label>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full pl-6 sm:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="sm:w-[50%] m-auto pb-4">
            {/* Full Name Input */}
            <div className="w-[100%]">
              <label className="block pb-2 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black dark:text-white"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="w-full pt-2 pb-4">
              <label className="block pb-2 text-sm font-medium">
                Email Address
              </label>
              <input
                type="text"
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                required
                value={user?.email}
              />
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              required
              className="w-full py-2 px-4 mt-8 text-white bg-purple-600 hover:bg-purple-700 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              value="Update"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
