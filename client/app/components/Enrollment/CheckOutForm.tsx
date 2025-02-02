import React, { useEffect, useState } from "react";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";
import { IoIosCloudDownload } from "react-icons/io";
import { redirect } from "next/navigation";
import { useLoadUserQuery } from "@/redux/features/api/ipaSlice";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any; // Function to close the modal after order creation
  data: any;
  user: any; // Course data (courseId, price, courseName, etc.)
  handleSuccessfulEnrollment: any;
};

const CheckOutForm = ({ setOpen, data, user }: Props) => {
  const [createOrder, { isLoading, isSuccess, error }] =
    useCreateOrderMutation();
  const {} = useLoadUserQuery({});
  const [message, setMessage] = useState<string>("");

  const [active, setActive] = useState(0); // Track active form section

  // Course information state
  const [courseInfo, setCourseInfo] = useState({
    courseId: data._id,
    price: data.price,
    courseName: data.name,
  });

  // User information state (added fields as per order model)
  const [userInfo, setUserInfo] = useState({
    fName: "",
    mName: "",
    lName: "",
    phoneNumber: "",
    age: "",
    bday: "",
    gender: "",
    civilStatus: "",
    city: "",
    btgy: "",
    street: "",
    province: "",
    school: "",
    schoolAddress: "",
    juniorHighSchool: "",
    juniorHighSchoolAddress: "",
    elementarySchool: "",
    elementarySchoolAddress: "",
    LRNnumber: "",
    profileImage: "",
    idPicture: { public_id: "", url: "" },
  });

  // Handle changes in the form fields
  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prevState) => ({
          ...prevState,
          profileImage: reader.result as string, // Save the base64 string or URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle ID picture change
  const handleIdPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prevState) => ({
          ...prevState,
          idPicture: {
            public_id: file.name, // Use the file name or a generated public_id
            url: reader.result as string, // Save the base64 string or URL
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Enroll form submitted successfully");
      setOpen(false); // Close the modal
      socketId.emit("notification", {
        title: "New Order",
        message: `You have a new student from ${data.name}`,
        userId: user._id,
      });
      redirect(`/course-access/${data._id}`);
    }

    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, setOpen, data._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Prepare the data to send to the API
    const orderData = {
      courseId: courseInfo.courseId,
      fName: userInfo.fName,
      mName: userInfo.mName,
      lName: userInfo.lName,
      phoneNumber: userInfo.phoneNumber,
      age: userInfo.age,
      bday: userInfo.bday,
      gender: userInfo.gender,
      civilStatus: userInfo.civilStatus,
      city: userInfo.city,
      btgy: userInfo.btgy,
      street: userInfo.street,
      province: userInfo.province,
      school: userInfo.school,
      schoolAddress: userInfo.schoolAddress,
      juniorHighSchool: userInfo.juniorHighSchool,
      juniorHighSchoolAddress: userInfo.juniorHighSchoolAddress,
      elementarySchool: userInfo.elementarySchool,
      elementarySchoolAddress: userInfo.elementarySchoolAddress,
      LRNnumber: userInfo.LRNnumber,
      profileImage: userInfo.profileImage,
      idPicture: userInfo.idPicture.url,
    };

    try {
      await createOrder(orderData).unwrap();
      setMessage("Order created successfully!");
    } catch (error) {
      setMessage("Error creating order");
      console.error("Error creating order:", error);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit}>
      <div>
        {/* Section 1: Course Information */}

        {/* Section 2: User Information */}
        {active === 0 && (
          <div>
            <div className="flex mb-4 gap-2">
              <div>
                <label className={`${styles.label}`}>First Name:</label>
                <input
                  className={`${styles.input}`}
                  type="text"
                  name="fName"
                  value={userInfo.fName}
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div>
                <label className={`${styles.label}`}>Middle Name:</label>
                <input
                  className={`${styles.input}`}
                  type="text"
                  name="mName"
                  value={userInfo.mName}
                  onChange={handleUserChange}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>Last Name:</label>
                <input
                  className={`${styles.input}`}
                  type="text"
                  name="lName"
                  value={userInfo.lName}
                  onChange={handleUserChange}
                  required
                />
              </div>
            </div>

            <div className="flex mb-4 gap-2">
              <div>
                <label className={`${styles.label}`}>Phone Number:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={userInfo.phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Remove non-digit characters
                    value = value.replace(/\D/g, "");

                    // Format the value by adding dashes every 4 digits
                    if (value.length <= 11) {
                      value = value.replace(/(\d{4})(?=\d)/g, "$1-");
                    }

                    // Update the state with the formatted value
                    setUserInfo((prevState) => ({
                      ...prevState,
                      phoneNumber: value,
                    }));
                  }}
                  className={`${styles.input}`}
                  maxLength={13} // 11 digits + 3 dashes
                  placeholder="Enter 11-digit Phone Number (e.g. 1234-567-8901)"
                />

                {userInfo.phoneNumber &&
                  userInfo.phoneNumber.replace(/-/g, "").length !== 11 && (
                    <p className="text-red-500 text-xs mt-2 border border-red-500 p-2 bg-red-200">
                      Phone Number must be exactly 11 digits.
                    </p>
                  )}
              </div>
            </div>

            <br />
            <div className="flex gap-2">
              <div>
                <label className={`${styles.label}`}>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={userInfo.age}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>Birthday:</label>
                <input
                  type="date"
                  name="bday"
                  value={userInfo.bday}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>Gender:</label>
                <select
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={`${styles.label}`}>Civil Status:</label>
                <select
                  name="civilStatus"
                  value={userInfo.civilStatus}
                  onChange={handleUserChange}
                  className={`${styles.input}`}
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>

            {/* Address Section */}
            <h3 className={`${styles.title} !text-left !text-[20px] mt-[20px]`}>
              Address:
            </h3>
            <div className="flex gap-2">
              <div>
                <label className={`${styles.label}`}>Municipality:</label>
                <input
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>Barangay:</label>
                <input
                  type="text"
                  name="btgy"
                  value={userInfo.btgy}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>Street:</label>
                <input
                  type="text"
                  name="street"
                  value={userInfo.street}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
            </div>
            <div>
              <label className={`${styles.label}`}>Province:</label>
              <input
                type="text"
                name="province"
                value={userInfo.province}
                onChange={handleUserChange}
                className={`${styles.input}`}
              />
            </div>
            <br />
            {active === 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setActive(1)}
                  className={`${styles.button}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {active === 1 && (
          <div>
            {/* Old School Name and Address */}
            <h3 className="mb-3 mt-5 text-[18px] dark:text-white text-black font-semibold">
              Eductaional Background
            </h3>
            <div className="flex justify-between gap-2">
              <div>
                <label className="dark:text-white text-black">
                  Senior High School Name:
                </label>
                <input
                  type="text"
                  name="school"
                  value={userInfo.school}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className="dark:text-white text-black">
                  School Address:
                </label>
                <input
                  type="text"
                  name="schoolAddress"
                  value={userInfo.schoolAddress}
                  onChange={handleUserChange}
                  required
                  className={`${styles.input}`}
                />
              </div>
            </div>
            <br />
            {/* Junior high */}
            <div className="flex gap-2">
              <div>
                <label className={`${styles.label}`}>
                  Junior High School Name:
                </label>
                <input
                  type="text"
                  name="juniorHighSchool"
                  value={userInfo.juniorHighSchool}
                  onChange={handleUserChange}
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>
                  Junior High School Address:
                </label>
                <input
                  type="text"
                  name="juniorHighSchoolAddress"
                  value={userInfo.juniorHighSchoolAddress}
                  onChange={handleUserChange}
                  className={`${styles.input}`}
                />
              </div>
            </div>
            <br />
            {/* Junior High and Elementary School */}
            <div className="flex gap-2">
              <div>
                <label className={`${styles.label}`}>
                  Elementary School Name:
                </label>
                <input
                  type="text"
                  name="elementarySchool"
                  value={userInfo.elementarySchool}
                  onChange={handleUserChange}
                  className={`${styles.input}`}
                />
              </div>
              <div>
                <label className={`${styles.label}`}>
                  Elementary School Address:
                </label>
                <input
                  type="text"
                  name="elementarySchoolAddress"
                  value={userInfo.elementarySchoolAddress}
                  onChange={handleUserChange}
                  className={`${styles.input}`}
                />
              </div>
            </div>
            <br />
            {/* LRN Number */}
            <div>
              <label className={`${styles.label}`}>LRN Number:</label>
              <input
                type="text"
                name="LRNnumber"
                value={userInfo.LRNnumber}
                onChange={(e) => {
                  let value = e.target.value;

                  // Remove non-digit characters
                  value = value.replace(/\D/g, "");

                  // Format the value by adding dashes every 4 digits
                  if (value.length <= 12) {
                    value = value.replace(/(\d{4})(?=\d)/g, "$1-");
                  }

                  // Update the state with the formatted value
                  setUserInfo((prevState) => ({
                    ...prevState,
                    LRNnumber: value,
                  }));
                }}
                className={`${styles.input}`}
                maxLength={14} // 12 digits + 3 dashes
                placeholder="Enter 12-digit LRN (e.g. 1234-4567-7895)"
              />

              {userInfo.LRNnumber &&
                userInfo.LRNnumber.replace(/-/g, "").length !== 12 && (
                  <p className="text-red-500 text-xs mt-2 border border-red-500 p-2 bg-red-200">
                    LRN Number must be exactly 12 digits.
                  </p>
                )}
            </div>

            <br />

            {/* Profile Image */}
            <div>
              <label className={`${styles.label}`}>Profile Image:</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className={`${styles.input}`}
              />
            </div>

            {/* ID Picture */}
            <div>
              <label className={`${styles.label}`}>ID Picture:</label>
              <input
                type="file"
                name="idPicture"
                accept="image/*"
                onChange={handleIdPictureChange}
                className={`${styles.input}`}
              />
            </div>
            <br />

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setActive(0)}
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.button} ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default CheckOutForm;
