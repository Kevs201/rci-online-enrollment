import React, { FC } from "react";
import CoursePLayer from "../../../utils/CoursePlayer";
import { styles } from "../../../../app/styles/style";
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit: boolean;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
  isEdit,
}) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  const prevButton = () => {
    setActive(active - 1 );
  }

  const CreateCourse = () => {
    handleCourseCreate();
  }

  return (
    <div className="w-[70%] m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <img
            src={courseData.thumbnail}
            alt=""
            className="max-h-full w-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px]">
            {courseData?.price === 0 ? "Free" : courseData?.price + "$"}
          </h1>
          <h5 className="pl-3 text-[120px] mt-2 line-through opacity-80">
            {courseData?.estimatedPrice}
          </h5>

          <h4 className="pl-5 pt-4 text-[22px]">
            {discountPercentagePrice}%off
          </h4>
        </div>

        <div className="flex items-center">
          <div
            className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed`}
          >
            Enrolle Now
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount code..."
            className={`${styles.input} 1500px:!w-[50%] 1100px:w-[60%] ml-3 !mt-0`}
          />
          <div
            className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>
        <p className="pb-1">• 4 Years Degree </p>
        <p className="pb-1">• Full lifetime access </p>
        <p className="pb-1">• Cetificate of completion </p>
      </div>
      <div className="w-full">
          <div className="w-full 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600]">
              {courseData?.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={0} />
                <h5>0 reviews</h5>
              </div>
              <h5>0 Students</h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600]">
              What you will learn from this course?
            </h1>
          </div>
          {courseData?.benefits?.map((item: any, index: number) => (
            <div className="w-full flex 800px:items-center py-2" key={index}>
              <div className="w-[15px] mr-1">
                <IoCheckmarkDoneOutline size={20} />
              </div>
              <p className="pl-2">{item.title}</p>
            </div>
          ))}
          <br />
          <br />
          {/* course descriptions */}
          <div className="w-full">
            <h1 className="text-[25px] font-Poppins font-[600]">
              Coursee Details
            </h1>
            <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden">
              {courseData?.description}
            </p>
          </div>
          <br />
          <br />
        </div>
        <div className="w-full flex items-center justify-between">
        <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-purple-700 text-center text-white rounded mt-8 cursor-pointer"
          onClick={()=> prevButton()}
        >
          Prev
        </div>
        <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-purple-700 text-center text-white rounded mt-8 cursor-pointer"
          onClick={()=> CreateCourse()}
        >
          {
            isEdit ? "Update Course" : "Create Course"
          }
        </div> 
      </div>
    </div>
  );
};

export default CoursePreview;
