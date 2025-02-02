
import { styles } from "@/app/styles/style";
import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import React, { useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import CheckOutForm from "../Enrollment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/ipaSlice";
import { useRouter } from "next/navigation";

type Props = {
  data: any; // Data for the course
};

const CourseDetails = ({ data }: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user;
  const [open, setOpen] = useState(false);
  const [isLoginPromptVisible, setIsLoginPromptVisible] = useState(false); // Track if login prompt is visible
  const router = useRouter(); // Initialize the useRouter hook

  // Calculate discount percentage if exists
  const discountPercentage =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercentage.toFixed(0);

  // Check if the course is already purchased by the user
  const isPurchased =
    user &&
    Array.isArray(user.courses) &&
    user.courses.some((item: any) => item._id === data._id);

  // Check if the user has already enrolled in any course
  const hasEnrolledInAnotherCourse =
    user && user.courses && user.courses.length > 0;

  // Handler to open the enrollment modal or show login prompt
  const handlerOrder = () => {
    if (!user) {
      setIsLoginPromptVisible(true); // Show login prompt if user is not logged in
    } else if (user?.role !== "admin" && hasEnrolledInAnotherCourse) {
      // User is not an admin and already enrolled in another course
      alert("You can only enroll in one course at a time.");
    } else {
      setOpen(true); // Open checkout form if user is logged in and not already enrolled (or admin)
    }
  };

  // Handle "Enter Course" redirection if already enrolled or if user is an admin
  const handleEnterCourse = () => {
    if (user?.role === "admin") {
      // Admin users can directly enter the course without filling out a form
      router.push(`/course-access/${data._id}`); // Redirect to course access page
    } else if (isPurchased) {
      router.push(`/course-access/${data._id}`); // Redirect if the course is already purchased
    } else {
      handlerOrder(); // Proceed with the order if not purchased
    }
  };

  // Redirect user after successful enrollment
  const handleSuccessfulEnrollment = () => {
    router.push(`/course-access/${data._id}`); // Redirect to the course access page
  };

  return (
    <div>
      {/* Main Content with background blur when login prompt is visible */}
      <div
        className={`w-[90%] 800px:w-[90%] m-auto py-5 ${
          isLoginPromptVisible ? "backdrop-blur-sm" : ""
        }`}
      >
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:[35%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {data.purchased} Students
            </h5>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What will you learn in this course?
            </h1>
            {data.benefits?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <CourseContentList data={data?.courseData} />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Description:
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]">
                  <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                    {Number.isInteger(data?.ratings)
                      ? data?.ratings.toFixed(1)
                      : data?.ratings.toFixed(2)}
                    {""} Course Rating . {data?.reviews?.length} Reviews
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Image & Enrollment */}
          <div className="w-full 800px:w-[65%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <Image
                src={data.thumbnail.url}
                width={500}
                height={300}
                alt={data.name}
                className="rounded-[10px]"
              />
              <p className="mt-3 capitalize text-lg text-[black] font-[600] dark:text-white">
                {data.name}
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <Ratings rating={data.ratings} />
                Ratings
              </div>
              <div className="flex items-center">
                {isPurchased || user?.role === "admin" ? (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-green-700`}
                    onClick={handleEnterCourse}
                  >
                    Enter Course
                  </div>
                ) : user?.role === "admin" || !hasEnrolledInAnotherCourse ? (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-blue-700`}
                    onClick={handlerOrder} // Open the checkout form if not yet enrolled (or admin)
                  >
                    Enroll now
                  </div>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-gray-400`}
                  >
                    You are already enrolled in another course
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt */}
      {isLoginPromptVisible && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 z-50 flex items-center justify-center">
          <div className="w-[600px] min-h-[200px] dark:bg-slate-600 bg-white rounded-lg shadow p-5 flex flex-col items-center justify-center">
            <p className="text-center text-[20px] font-semibold text-black dark:text-white">
              Please login first to enroll in the course.
            </p>
            {/* Close Button */}
            <div
              className="mt-4 p-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
              onClick={() => setIsLoginPromptVisible(false)} // Close the prompt
            >
              Close
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {open && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 z-50 flex items-center justify-center">
          <div className="w-[800px] min-h-[500px] dark:bg-slate-600 bg-white rounded-lg shadow p-5">
            <div className="w-full flex justify-between">
              <p className="dark:text-slate-300 text-gray-500 font-[700]">
                {data.name}
              </p>
              <IoCloseOutline
                size={25}
                className="dark:text-white text-slate-500 cursor-pointer hover:text-red-500"
                onClick={() => setOpen(false)} // Close the modal on close icon click
              />
            </div>
            <hr className="w-full mt-2 border-t-2 dark:border-slate-500 border-gray-300" />
            <br />
            <div className="w-full">
              <CheckOutForm
                setOpen={setOpen}
                data={data}
                user={user}
                handleSuccessfulEnrollment={handleSuccessfulEnrollment} // Pass the redirect function to CheckOutForm
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
