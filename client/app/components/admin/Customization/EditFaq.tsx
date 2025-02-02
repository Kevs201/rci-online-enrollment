import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFaq = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess:layoutSuccess, error }] = useEditLayoutMutation();

  // State to store questions
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(
        data.layout.faq.map((item: any) => ({
          ...item,
          question: item.question || "",
          answer: item.answer || "",
        }))
      );
    }
    if (layoutSuccess) {
      refetch();
      toast.success("FAQ updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data,layoutSuccess,error]);

  // Function to toggle the visibility of answers
  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  // Handle change in the question field
  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  // Handle change in the answer field
  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  // Add a new FAQ item
  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  // Function to check if questions are unchanged
  const areQuestionsUnchanged = (
    originalQuestions: any[],
    newQuestions: any[]
  ) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  // Function to check if any question is empty
  const isAnyQuestionsEmpty = (questions: any[]) => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };

  // Handle the save operation (for now, just logs 'gggg')
  const handleEdit = async () => {
    if (
      !areQuestionsUnchanged(data.layout.faq, questions) &&
      !isAnyQuestionsEmpty(questions)
    ) {
      await editLayout({
        type: "FAQ",
        faq: questions,
      });
    }
  };

  return (
    <>
    {
      isLoading ? (
        <Loader/>
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
      <div className="mt-12">
        <dl className="space-y-8">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className={`${
                q._id !== questions[0]?._id && "border-t-[1px] border-gray-300"
              } border-gray-200 pt-6`}
            >
              <dt className="text-lg">
                <button
                  className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <input
                    className={`${styles.input} border-none`}
                    value={q.question} // Update here to use `question` not `questions`
                    onChange={(e: any) =>
                      handleQuestionChange(q._id, e.target.value)
                    }
                    placeholder={"Add your question..."}
                  />

                  <span className="ml-6 flex-shrink-0">
                    {q.active ? (
                      <HiMinus className="h-6 w-6" />
                    ) : (
                      <HiPlus className="h-6 w-6" />
                    )}
                  </span>
                </button>
              </dt>
              {q.active && (
                <dd className="mt-2 pr-12">
                  <input
                    className={`${styles.input} border-none`}
                    value={q.answer}
                    onChange={(e: any) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                    placeholder={"Add your answer..."}
                  />
                  <span className="ml-6 flex-shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setQuestions((prevQuestions) =>
                          prevQuestions.filter((item) => item._id !== q._id)
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <br />
        <br />
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>

      <div
        className={`${
          styles.button
        } !w-[100px] !min-h-[40px] dark:text-white text-black bg-[#cccccc34] ${
          areQuestionsUnchanged(data?.layout?.faq, questions) ||
          isAnyQuestionsEmpty(questions)
            ? "!cursor-pointer"
            : "!cursor-pointer !bg-purple-700"
        }
      !rounded absolute bottom-12 right-12`}
        onClick={
          areQuestionsUnchanged(data?.layout?.faq, questions) ||
          isAnyQuestionsEmpty(questions)
            ? () => null
            : handleEdit
        }
      >
        Save
      </div>
    </div>
      )
    }
    </>
  );
};

export default EditFaq;
