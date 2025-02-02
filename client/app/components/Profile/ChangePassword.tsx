import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordCHangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmedPassword) {
      toast.error("Password does not match!");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2 ">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordCHangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2  text-black dark:text-[#fff]">
              Enter your old password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0  text-black dark:text-[#fff] border border-gray-500 dark:border-white`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2  text-black dark:text-[#fff]">
              Enter your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0  text-black dark:text-[#fff] border border-gray-500 dark:border-white`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2  text-black dark:text-[#fff]">
              Enter your confirm password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0  text-black dark:text-[#fff] border border-gray-500 dark:border-white`}
              required
              value={confirmedPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              type="submit"
              className={`w-[95%] py-2 px-4 mt-8 text-white bg-purple-600 hover:bg-purple-700 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500`}
              value="Update"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
