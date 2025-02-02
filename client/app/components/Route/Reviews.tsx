import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReivewCard from "../Review/ReivewCard"

type Props = {};

export const reviews = [
  {
    name: "Raden Batanes",
    avatar: "/assets/avatar.png",
    course: "Student ! BSIS",
    comment:
      "fine-tune the transition or resize parameters according to your needs. Let me know if you need more assistance!",
  },
  {
    name: "Kosme Antones",
    avatar: "/assets/richwell.jpg",
    course: "Student ! BSIS",
    comment:
      "fine-tune the transition or resize parameters according to your needs. Let me know if you need more assistance!",
  },
  {
    name: "Labayne Kamote",
    avatar: "/assets/richwell.jpg",
    course: "Student ! BSIS",
    comment:
      "fine-tune the transition or resize parameters according to your needs. Let me know if you need more assistance!",
  },
  {
    name: "Karina Balmon",
    avatar: "/assets/richwell.jpg",
    course: "Student ! BSIS",
    comment:
      "fine-tune the transition or resize parameters according to your needs. Let me know if you need more assistance!",
  },
  {
    name: "Juswa Talong",
    avatar: "/assets/richwell.jpg",
    course: "Student ! BSIS",
    comment:
      "fine-tune the transition or resize parameters according to your needs. Let me know if you need more assistance!",
  },
  {
    name: "Kalamatis Suhak",
    avatar: "/assets/richwell.jpg",
    course: "Student ! BSIS",
    comment:
      "fine-tune the transition or resize parameters according to your needs. Let me know if you need more assistance!",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require(`../../../public/assets/richwell.jpg`)}
            alt="business"
            width={500}
            height={500}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Student Are{" "}
            <span className="text-purple-700">Our Strenght</span>
            {""}
            <br />
            See What They Say About Us
          </h3>
          <br />
          <p className={`${styles.label}`}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
            voluptatem, distinctio eius facilis autem consectetur magni quas
            ducimus necessitatibus a nemo tenetur doloribus nisi accusantium?
            Placeat, assumenda modi! Saepe, voluptate!
          </p>
        </div>
      </div>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(6)]:!mt-[-40px]">
            {reviews && 
                reviews.map((i, index) => <ReivewCard item={i} key={index}/>)
            }
        </div>
    </div>
  );
};

export default Reviews;
