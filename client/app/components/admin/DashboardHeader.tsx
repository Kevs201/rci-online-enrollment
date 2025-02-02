"use client";
import { ThemeSwitcher } from "@/app/utils/ThemeSwithcer";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationsMutation,
} from "@/redux/features/notifications/notificationsApi";
import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationsMutation();
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.stattus === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
  }, [data, isSuccess]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
    });
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="relative w-full flex items-center justify-end p-6">
      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Notification Bell */}
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>

      {/* Notifications Panel */}
      {open && (
        <div className="w-[350px] h-[60vh] overflow-y-auto py-3 px-2 border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {/* Notifications List */}
          {notifications &&
            notifications.map((item: any) => (
              <div
                key={item._id}
                className={`${
                  item.status === "unread"
                    ? "bg-[#f5f5f5] text-black font-semibold"
                    : "bg-[#f0f0f0] text-gray-700"
                } dark:bg-[#2d3a4ea1] dark:text-white border-b dark:border-b-[#ffffff47] border-[#00000f]`}
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">{item.title}</p>
                  <p
                    className="text-black dark:text-white cursor-pointer"
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">{item.message}</p>
                <p className="p-2 text-black dark:text-white text-[12px]">
                  {format(item.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
