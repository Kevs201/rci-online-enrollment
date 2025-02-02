import React, { useEffect, useState } from "react";
import {
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import Loader from "../../Loader/Loader";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type Props = {
  id: any;
};

const ViewStudent = ({ id }: Props) => {
  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetSingleOrderQuery(id);
  console.log(orderData);
  const { data: usersData } = useGetAllUsersQuery({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility
  const [cancellationReason, setCancellationReason] = useState(""); // State to manage cancellation reason

  // Find the user email based on the userId
  useEffect(() => {
    if (usersData && orderData?.order?.userId) {
      const user = usersData.users.find(
        (user: any) => user._id === orderData?.order.userId
      );
      if (user) {
        setUserEmail(user.email);
      }
    }
  }, [orderData?.order?.userId, usersData]);

  if (isLoading)
    return (
      <div className="text-center text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Error loading order details
      </div>
    );

  const order = orderData?.order;

  if (!order) {
    return (
      <div className="text-center text-lg font-semibold text-gray-500">
        No order data available.
      </div>
    );
  }

  // Handle the order status update (approve or cancel)
  const handleUpdateStatus = async (
    status: string,
    cancellationReason: string | null = ""
  ) => {
    try {
      await updateOrderStatus({
        orderId: order._id,
        status,
        cancellationReason,
      });
      await refetch();
      alert(
        `Order has been ${status === "approved" ? "approved" : "canceled"}`
      );
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  // Function to handle opening the cancellation dialog
  const handleCancelOrder = () => {
    setOpenDialog(true);
  };

  // Function to handle dialog submission
  const handleConfirmCancel = () => {
    handleUpdateStatus("canceled", cancellationReason);
    setOpenDialog(false);
    setCancellationReason(""); // Reset the reason input
  };

  // Function to handle dialog close
  const handleCancelDialog = () => {
    setOpenDialog(false);
    setCancellationReason(""); // Reset the reason if user cancels
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden p-[50px] space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Information
          </h1>
          <h1
            className={`uppercase font-[800] ${
              order?.status === "canceled"
                ? "text-red-500"
                : order?.status === "pending"
                ? "text-blue-500"
                : order?.status === "approved"
                ? "text-green-500"
                : "text-gray-500" // Default color in case status is unknown
            }`}
          >
            Form {order?.status}
          </h1>

          {/* Left Column: Order/Student Information */}
          <div className="grid-cols-1 md:grid-cols-2 gap-6 flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36 capitalize">
                  id Number:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.orderDataID}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36 capitalize">
                  Full Name:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.fName} {order?.mName} {order?.lName}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36 capitalize">
                  Phone Number:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.phoneNumber}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  LRN number:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.LRNnumber}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Age:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.age}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Birthday:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {new Date(order?.bday).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Gender:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.gender}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Civil Status:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.civilStatus}
                </span>
              </div>
              {/* Display the user's email */}
              {userEmail && (
                <div className="flex items-center">
                  <label className="text-gray-600 dark:text-gray-300 w-36">
                    Email:
                  </label>
                  <span className="text-gray-800 dark:text-white">
                    {userEmail}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Profile Image */}
            <div className="flex justify-center items-center">
              <div className="w-40 h-40 bg-gray-200 rounded-[1px] overflow-hidden flex items-center justify-center mb-10 border-white border-[3px]">
                {order?.profileImage?.url ? (
                  <Image
                    src={order.profileImage.url}
                    width={1000}
                    height={1000}
                    alt={`${order?.fName}'s Profile`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-xl font-bold text-gray-600">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student's School Information */}
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              School Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  School:
                </label>
                <span className="text-gray-800 dark:text-white capitalize">
                  {order?.school}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  School Address:
                </label>
                <span className="text-gray-800 dark:text-white capitalize">
                  {order?.schoolAddress}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Junior High School:
                </label>
                <span className="text-gray-800 dark:text-white capitalize">
                  {order?.juniorHighSchool}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Junior High Address:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.juniorHighSchoolAddress}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Elementary School:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.elementarySchool}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Elementary Address:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.elementarySchoolAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  City:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.city}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Barangay:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.btgy}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Street:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.street}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Province:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.province}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Course ID:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.courseId}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Extension:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.extension || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  User ID:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {order?.userId}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Created At:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {new Date(order?.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <label className="text-gray-600 dark:text-gray-300 w-36">
                  Updated At:
                </label>
                <span className="text-gray-800 dark:text-white">
                  {new Date(order?.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Update */}
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Order Status
            </h2>
            <div className="flex space-x-4">
              {order.status !== "approved" && (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
                    onClick={() => handleUpdateStatus("approved")}
                  >
                    <IoCheckmarkDoneOutline className="mr-2" />
                    Approve Form
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center"
                    onClick={handleCancelOrder}
                  >
                    <IoCloseOutline className="mr-2" />
                    Cancel Form
                  </button>
                </>
              )}
              {order.status === "approved" && (
                <>
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-xl font-sm text-[12px] text-green-600">
                      This form has already been approved
                    </div>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center"
                      onClick={handleCancelOrder}
                    >
                      <IoCloseOutline className="mr-2" />
                      Cancel Form
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Reason Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDialog}>
        <DialogTitle>Provide a Reason for Cancellation (Optional)</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            fullWidth
            variant="outlined"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            helperText="Leave blank if no reason."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmCancel} color="primary">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewStudent;
