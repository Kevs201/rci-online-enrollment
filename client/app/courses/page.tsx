"use client"; // Mark the file as a client-side component

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState, Suspense } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Route/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [search, setSearch] = useState<string | null>(null); // Manage search state
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState("All");

  // Fetch and filter courses based on category and search query
  useEffect(() => {
    if (data) {
      let filteredCourses = data?.courses;

      // Filter based on category
      if (category !== "All") {
        filteredCourses = filteredCourses.filter((item: any) => item.categories === category);
      }

      // Filter based on search query
      if (search) {
        filteredCourses = filteredCourses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setCourses(filteredCourses); // Update the courses state after filtering
    }
  }, [data, category, search]); // Re-run when data, category, or search changes

  const categories = categoriesData?.layout.categories;

  return (
    <Suspense fallback={<Loader />}> {/* Wrap in Suspense for proper handling */}
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Header
              route={route}
              setRoute={setRoute}
              open={open}
              setOpen={setOpen}
              activeItem={1}
            />
            <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
              <Heading
                title={"All courses - Enrollment system"}
                description={""}
                keywords={"Please enroll now"}
              />
              <br />
              <div className="w-full flex items-center flex-wrap">
                <div
                  className={`h-[35px] ${category === "All" ? "bg-yellow-600" : "bg-purple-600"} m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setCategory("All")}
                >
                  All
                </div>
                {categories &&
                  categories.map((item: any, index: number) => (
                    <div key={index}>
                      <div
                        className={`h-[35px] ${category === item.title ? "bg-yellow-600" : "bg-purple-600"} m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                        onClick={() => setCategory(item.title)}
                      >
                        {item.title}
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Search Input Field */}
              {/* <div className="w-full flex justify-center mb-4">
                <input
                  type="text"
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for courses"
                  className="p-2 border rounded-md"
                />
              </div> */}

              {courses.length === 0 && (
                <p
                  className={`${styles.label} flex justify-center min-h-[50vh] !text-red-700 items-center`}
                >
                  {search
                    ? "No course found!"
                    : "No courses found in this category. Please try another one!"}
                </p>
              )}

              <br />
              <br />
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px]">
                {courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
              </div>
            </div>
          </>
        )}
        <Footer />
      </div>
    </Suspense>
  );
};

export default Page;
