import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div>
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        About <span className="text-purple-600">Us</span>
      </h1>
      <br />
      <div className="flex items-center justify-between">
        <div className="w-[95%] 800px:w-[85%] m-auto">
          <p className="text-[18px] font-Poppins dark:text-gray-300 text-gray-700">
            Richwell College had its root from a vision in 2010. The vision was
            about a college institution that would be accessible to all students
            in Plaridel and nearby towns particularly those commuting from poor
            families for whom college education is an impossibility. College
            education is the only bridge to the great divide between the chain
            of poverty and the liberating prosperity in life, hence the Richwell
            vision.
            <br />
            <br />
            The foremost question then was how to make the vision a reality: the
            capital for school building and facilities; the funds and resources
            to start the college; the competencies in administering a college
            institution; and the official recognition of TESDA, DEPED, and CHED.
            <br />
            <br />
            The answer to the question simply pointed to one--it was virtually
            impossible. However, it was when everything seemed impossible that
            one direction became crystal clear--pursue the vision nevertheless
            with a great leap of faith. A leap of faith is to believe that any
            dream is possible notwithstanding the improbable chance.
          </p>
          <br />
          <br />
          <div className="flex items-center justify-between gap-10">
            <div className="w-[50%] border border-purple-300 mb-[300px] p-5">
              <h2 className="text-[25px] font-[600] text-purple-700">Vision</h2>
              <br />
              <p className="text-[18px] font-Poppins dark:text-gray-300 text-gray-700">
                Richwell Colleges is an institution transforming the lives of
                the youth towards success and prosperity through excellent
                education focused on competencies and skills anchored on the
                values of excellence, integrity, perseverance, love of parents,
                kindness for others, ingrained patriotism, care for the environment,
                and faithful reverence in God.
                <br />
                <br />
                Richwell Colleges Incorporated will be a University
              </p>
            </div>
            <div className="w-[50%] border border-purple-300 p-5 mt-[20px]">
              <h2 className="text-[25px] font-[600] text-purple-700">
                Mission
              </h2>
              <br />
              <p className="text-[18px] font-Poppins dark:text-gray-300 text-gray-700">
                I. Make competencies and excellence the standard for everything
                the institution has to offer, and the norm for which the graduates
                will become.
                <br />
                <br />
                II. Mold the students with the character and ability to seek the
                answers to many questions and unknowns that they will encounter
                in their journey to success.
                <br />
                <br />
                III. Develop with the students the traits and discipline of
                leadership so they could reach out to become strategic and
                respected leaders way beyond just being simply educated.
                <br />
                <br />
                IV. Motivate the students in entrepreneurial vision to harness
                the nation and apos s rich resources, generate job opportunities, and
                make a difference for a prosperous country.
                <br />
                <br />
                V. Nurture and strengthen the spiritual dimension and faithful
                reverence in God in the life of every student.
                <br />
                <br />
                VI. Make the life of every student anchored on moral and
                spiritual values.
                <br />
                <br />
              </p>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default About;
